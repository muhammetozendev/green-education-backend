import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import jwtConfig from 'src/config/env/jwt-config';
import { UserDto } from '../../dto/user.dto';
import { RefreshTokenPayloadDto } from '../../dto/refresh/refresh-token-payload.dto';
import { User } from 'src/resources/users/repositories/user/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class TokenService {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  signToken<T extends object>(expiry: number, payload: T): string {
    return jwt.sign(payload, this.jwtConfiguration.secret, {
      expiresIn: expiry,
    });
  }

  verifyToken<T>(token: string): T {
    try {
      return jwt.verify(token, this.jwtConfiguration.secret) as T;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  generateAccessToken(payload: UserDto): string {
    return this.signToken(this.jwtConfiguration.accessTokenExpiry, payload);
  }

  generateRefreshToken(payload: RefreshTokenPayloadDto): string {
    return this.signToken(this.jwtConfiguration.refreshTokenExpiry, payload);
  }

  generateTokens(
    payload: User,
    sessionId: string,
  ): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.generateAccessToken({
        id: payload.id,
        email: payload.email,
        name: payload.name,
        lastName: payload.lastName,
        role: payload.role,
        organizationId: payload.organization?.id,
      }),
      refreshToken: this.generateRefreshToken({
        userId: payload.id,
        sessionId: sessionId,
      }),
    };
  }
}
