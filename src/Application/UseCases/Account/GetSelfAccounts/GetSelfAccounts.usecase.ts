import { KEY_OF_INJECTION } from '@metadata';
import { Inject, Injectable } from '@nestjs/common';
import { PayloadType } from '@types';
import { PaginationDto } from 'src/@shared/@Pagination';
import { IAccountRepositoryContact } from 'src/Domain/Interfaces/Repositories/IAccount.repository-contract';
import { IUserRepositoryContract } from 'src/Domain/Interfaces/Repositories/IUser.repository-contract';

@Injectable()
export class GetSelfAccountsUseCase {
  constructor(
    @Inject(KEY_OF_INJECTION.USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_OF_INJECTION.ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepositoryContact,
  ) {}

  async execute(payload: PayloadType, pagination: PaginationDto) {
    console.log(pagination);

    const accounts = await this.accountRepository.getMany({
      ...pagination,
      filters: {
        ...pagination.filters,
        userId: payload.sub,
      },
    });

    return accounts;
  }
}
