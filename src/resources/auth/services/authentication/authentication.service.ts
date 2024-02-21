import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/resources/users/services/user.service';
import { SessionRepository } from '../../repositories/session/session.repository';
import { CreateUserDto } from 'src/resources/users/dto/create-user.dto';
import { RegisterResDto } from '../../dto/register/register-res.dto';
import { AbstractHashingService } from '../hashing/abstract-hashing-service';
import { mapObject } from 'src/common/utils/object-mapper';
import { LoginResDto } from '../../dto/login/login-res.dto';
import { LoginDto } from '../../dto/login/login.dto';
import { TokenService } from '../token/token.service';
import { RefreshTokenPayloadDto } from '../../dto/refresh/refresh-token-payload.dto';
import { randomUUID } from 'crypto';
import { RefreshResDto } from '../../dto/refresh/refresh-res.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionRepository: SessionRepository,
    private readonly hashingService: AbstractHashingService,
    private readonly tokenService: TokenService,
  ) {}

  async login(data: LoginDto): Promise<LoginResDto> {
    // Find user by email
    const user = await this.userService.findOneByEmail(data.email);

    // Throw 401 if user not found
    if (!user) {
      throw new UnauthorizedException('Authentication failed');
    }

    // Compare password
    const isPasswordValid = await this.hashingService.compare(
      data.password,
      user.password,
    );

    // Throw 401 if password is invalid
    if (!isPasswordValid) {
      throw new UnauthorizedException('Authentication failed');
    }

    // Generate token
    const accessToken = this.tokenService.generateAccessToken({
      id: user.id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      organizationId: user.organization?.id,
      role: user.role,
    });

    // Return tokens
    return mapObject(LoginResDto, { accessToken });
  }

  async register(data: CreateUserDto): Promise<RegisterResDto> {
    // Throw 409 if user exists
    const user = await this.userService.findOneByEmail(data.email);
    if (user) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    data.password = await this.hashingService.hash(data.password);

    // Create user
    const createdUser = await this.userService.create(data);

    return mapObject(RegisterResDto, createdUser);
  }

  async refresh(refreshToken: string) {
    let token: RefreshTokenPayloadDto;

    // Verify token
    try {
      token = this.tokenService.verifyToken(refreshToken);
      if (!token.sessionId || !token.userId) {
        throw new Error();
      }
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    // Find session
    const session = await this.sessionRepository.findOneBy({
      refreshToken: refreshToken,
    });

    // Invalidate all sessions when token reuse is detected
    if (!session) {
      await this.sessionRepository.terminateSession(token.sessionId);
      throw new UnauthorizedException(
        'Token reuse detected. Terminating session!',
      );
    }
    if (!session.isValid) {
      throw new UnauthorizedException('Session is invalid');
    }

    // Generate tokens
    const user = await this.userService.findOne(token.userId);
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }
    const tokens = this.tokenService.generateTokens(user, token.sessionId);

    // Update session to have the new refresh token
    await this.sessionRepository.update(token.sessionId, {
      refreshToken: tokens.refreshToken,
      issuedAt: new Date(),
    });

    return mapObject(RefreshResDto, tokens);
  }

  getSessions() {
    return this.sessionRepository.findWithPagination(10, 1);
  }
}
