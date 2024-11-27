import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PayloadType } from '@types';

export const Payload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as PayloadType;
  },
);
