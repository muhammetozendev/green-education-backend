import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { USER_KEY } from '../auth.constants';

export const ActiveUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request[USER_KEY];
  },
);
