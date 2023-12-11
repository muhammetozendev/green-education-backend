import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';
import jwtConfig from 'src/config/env/jwt-config';
import * as jwt from 'jsonwebtoken';
import { UserDto } from '../dto/user.dto';
import { USER_KEY } from '../auth.constants';

@Injectable()
export class JwtAccessTokenGuard implements CanActivate {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const token = this.getTokenFromRequest(request);
    if (!token) {
      return false;
    }

    try {
      const payload = jwt.verify(
        token,
        this.jwtConfiguration.secret,
      ) as UserDto;
      if (!payload.email) {
        return false;
      }
      request[USER_KEY] = payload;
      return true;
    } catch (error) {
      return false;
    }
  }

  getTokenFromRequest(request: Request): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      return null;
    }
    return token;
  }
}
