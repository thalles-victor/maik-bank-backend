import { ObjectType } from '@nestjs/graphql';
import { ApiResponseObjectType } from './ApiResponse.object-type';
import { TransactionAggregate } from '../Aggregates/Transactions.aggregate';

@ObjectType()
export class TransactionObjectTypeResponse extends ApiResponseObjectType(
  TransactionAggregate,
) {}

@ObjectType()
export class TransactionsObjectTypeResponse extends ApiResponseObjectType(
  TransactionAggregate,
  {
    isArray: true,
  },
) {}
