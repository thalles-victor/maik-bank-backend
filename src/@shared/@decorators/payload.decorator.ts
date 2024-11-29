import {
  ContextType,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PayloadType } from '@types';

export const Payload = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const reqType = context.getType<ContextType | 'graphql'>();

    if (reqType === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const ctx = gqlCtx.getContext();

      const request = ctx.req;

      return request.user;
    } else if (reqType === 'http') {
      const request = context.switchToHttp().getRequest();
      return request.user as PayloadType;
    } else {
      // handle rpc and ws if you have them, otherwise ignore and make previous `else if` just an `else`
    }
  },
);
