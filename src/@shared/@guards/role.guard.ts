import { ROLE } from '@metadata';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ThrowErrorMessage } from '@types';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const jwtPayload = request.user;

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
