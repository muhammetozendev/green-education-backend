import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorators/role.decorator';
import { USER_KEY } from '../auth.constants';
import { UserDto } from '../dto/user.dto';
import { RoleEnum } from '../enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly refrector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.refrector.getAllAndOverride(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) as RoleEnum[];

    if (!role) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request[USER_KEY] as UserDto;

    if (!role.includes(user.role)) {
      throw new ForbiddenException('Forbidden');
    }

    return true;
  }
}
