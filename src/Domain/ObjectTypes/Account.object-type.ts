import { Field, ObjectType } from '@nestjs/graphql';
import { AccountModel } from '../Entities/Account.entity';
import { ApiResponseObjectType } from './ApiResponse.object-type';
import { TransactionAggregate } from '../Aggregates/Transactions.aggregate';
import { PaginationProps } from '@types';

@ObjectType()
export class AccountObjectTypeResponse extends ApiResponseObjectType(
  AccountModel,
) {}

@ObjectType()
export class AccountListObjectTypeResponse extends ApiResponseObjectType(
  AccountModel,
  { isArray: true },
) {}

@ObjectType()
export class PaginationObjectType implements PaginationProps {
  @Field(() => Number)
  page?: number;

  @Field(() => Number)
  limit?: number;

  @Field(() => Number)
  total: number;
}

@ObjectType()
class TransactionsListWithPage {
  @Field(() => [TransactionAggregate])
  data: TransactionAggregate[];

  @Field(() => PaginationObjectType)
  metadata: PaginationObjectType;
}

@ObjectType()
class AccountInformationObjectType {
  @Field(() => AccountModel)
  account: AccountModel;

  @Field(() => TransactionsListWithPage)
  transactions: TransactionsListWithPage;
}

@ObjectType()
export class AccountInformationObjectTypeResponse extends ApiResponseObjectType(
  AccountInformationObjectType,
) {}
