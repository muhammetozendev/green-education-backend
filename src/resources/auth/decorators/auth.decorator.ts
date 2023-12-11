import { SetMetadata } from '@nestjs/common';
import { AuthType } from '../enums/auth-type.enum';

export const AUTH_KEY = 'authType';

export const Auth = (...authType: AuthType[]) =>
  SetMetadata(AUTH_KEY, authType);
