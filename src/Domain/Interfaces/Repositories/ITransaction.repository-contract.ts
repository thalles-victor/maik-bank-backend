import {
  TransactionAggregate,
  TransactionAggregateUnqRef,
  TransactionUpdateAggregate,
} from 'src/Domain/Aggregates/Transactions.aggregate';
import { IBaseRepositoryContract } from './IBase.repository-contract';

export type TransferProps = {
  senderId: string;
  targetId: string;
  value: number;
  transactionId: string;
};

export interface ITransactionRepositoryContract
  extends IBaseRepositoryContract<
    TransactionAggregate,
    TransactionUpdateAggregate,
    TransactionAggregateUnqRef
  > {
  transfer(data: TransferProps): Promise<any>;
}
