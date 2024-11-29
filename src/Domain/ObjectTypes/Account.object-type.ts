import { ObjectType } from '@nestjs/graphql';
import { AccountModel } from '../Entities/Account.entity';
import { ApiResponseObjectType } from './ApiResponse.object-type';

@ObjectType()
export class AccountObjectTypeResponse extends ApiResponseObjectType(
  AccountModel,
) {}

@ObjectType()
export class AccountListObjectTypeResponse extends ApiResponseObjectType(
  AccountModel,
  { isArray: true },
) {}
