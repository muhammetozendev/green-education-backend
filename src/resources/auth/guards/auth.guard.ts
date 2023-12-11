import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthType } from '../enums/auth-type.enum';
import { JwtAccessTokenGuard } from './jwt-access-token.guard';
import { AUTH_KEY } from '../decorators/auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly refrector: Reflector,
    private readonly jwtAccessTokenGuard: JwtAccessTokenGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes: AuthType[] =
      this.refrector.getAllAndOverride(AUTH_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? ([AuthType.JWT_ACCESS_TOKEN] as AuthType[]);

    if (authTypes.includes(AuthType.NONE)) {
      return true;
    }

    let isAuth: boolean = false;

    for (const authType of authTypes) {
      switch (authType) {
        case AuthType.JWT_ACCESS_TOKEN:
          isAuth = await Promise.resolve(
            this.jwtAccessTokenGuard.canActivate(context),
          ).catch(() => false);
          break;
      }

      if (isAuth) {
        return true;
      }
    }

    throw new UnauthorizedException('Authentication failed');
  }
}
