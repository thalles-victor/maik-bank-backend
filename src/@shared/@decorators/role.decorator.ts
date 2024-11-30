import { ROLE } from '@metadata';
import { SetMetadata } from '@nestjs/common';

export const ROLES_METADATA = 'roles';

export const RolesDecorator = (...roles: ROLE[]) =>
  SetMetadata(ROLES_METADATA, roles);
