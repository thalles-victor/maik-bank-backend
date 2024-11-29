import { ObjectType } from '@nestjs/graphql';
import { TransactionAggregate } from '../Aggregates/Transactions.aggregate';
import { ApiResponseObjectType } from './ApiResponse.object-type';

@ObjectType()
export class TransferObjectTypeResponse extends ApiResponseObjectType(
  TransactionAggregate,
) {}
