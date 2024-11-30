import { KEY_OF_INJECTION } from '@metadata';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { PaginationDto } from 'src/@shared/@Pagination';
import { IAccountRepositoryContact } from 'src/Domain/Interfaces/Repositories/IAccount.repository-contract';
import { ITransactionRepositoryContract } from 'src/Domain/Interfaces/Repositories/ITransaction.repository-contract';
import { IUserRepositoryContract } from 'src/Domain/Interfaces/Repositories/IUser.repository-contract';

@Injectable()
export class GetManyTransactions {
  constructor(
    @Inject(KEY_OF_INJECTION.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepositoryContract,
    @Inject(KEY_OF_INJECTION.USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_OF_INJECTION.ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepositoryContact,
  ) {}

  async execute(pagination: PaginationDto) {
    const transactions = await this.transactionRepository.getMany(pagination);

    return transactions;
  }
}
