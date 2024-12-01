import { ROLE } from '@metadata';
import {
  CanActivate,
  ContextType,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PayloadType, ThrowErrorMessage } from '@types';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get('roles', context.getHandler());
    const reqType = context.getType<ContextType | 'graphql'>();

    if (!roles) {
      return true;
    }

    let jwtPayload: PayloadType;
    if (reqType === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const ctx = gqlCtx.getContext();

      const request = ctx.req;

      jwtPayload = request.user;
    } else if (reqType === 'http') {
      const request = context.switchToHttp().getRequest();
      jwtPayload = request.user as PayloadType;
    } else {
      // handle rpc and ws if you have them, otherwise ignore and make previous `else if` just an `else`
    }

    if (!jwtPayload) {
      console.log('\u001b[31m Auth guard not implemented in method');
      throw new InternalServerErrorException();
    }

    const isValidRole = this.matchRoles(roles, jwtPayload.roles);

    if (!isValidRole) {
      throw new ForbiddenException({
        ptBr: `Somente ${roles.toString()} tem permissão para acessar esse método`,
        enUs: `Only ${roles.toString()} can be access this method`,
        statusCode: 403,
      } as ThrowErrorMessage);
    }

    return isValidRole;
  }

  private matchRoles(
    requiredRoles: Array<ROLE>,
    rolesOfTheStudent: Array<ROLE>,
  ) {
    return requiredRoles.some((role) => rolesOfTheStudent.includes(role));
  }
}
