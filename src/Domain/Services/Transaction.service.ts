import { KEY_OF_INJECTION } from '@metadata';
import { Inject, Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/@shared/@Pagination';
import { ITransactionRepositoryContract } from '../Interfaces/Repositories/ITransaction.repository-contract';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(KEY_OF_INJECTION.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepositoryContract,
  ) {}

  async getMany(pagination: PaginationDto) {
    const transactions = await this.transactionRepository.getMany(pagination);

    return transactions;
  }
}
