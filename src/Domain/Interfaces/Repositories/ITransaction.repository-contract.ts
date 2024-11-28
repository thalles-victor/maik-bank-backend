import {
  TransactionAggregate,
  TransactionAggregateUnqRef,
  TransactionUpdateAggregate,
} from 'src/Domain/Aggregates/Transactions.aggregate';
import { IBaseRepositoryContract } from './IBase.repository-contract';

export type ITransactionRepositoryContract = IBaseRepositoryContract<
  TransactionAggregate,
  TransactionUpdateAggregate,
  TransactionAggregateUnqRef
>;
