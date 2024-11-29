import { ObjectType } from '@nestjs/graphql';
import { AccountModel } from '../Entities/Account.entity';
import { ApiResponseObjectType } from './ApiResponse.object-type';

@ObjectType()
export class AccountObjectTypeResponse extends ApiResponseObjectType(
  AccountModel,
) {}
