import { KEY_OF_INJECTION } from '@metadata';
import { Inject, Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/@shared/@Pagination';
import { IAccountRepositoryContact } from 'src/Domain/Interfaces/Repositories/IAccount.repository-contract';
import { IUserRepositoryContract } from 'src/Domain/Interfaces/Repositories/IUser.repository-contract';

@Injectable()
export class GetManyAccountUseCase {
  constructor(
    @Inject(KEY_OF_INJECTION.USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_OF_INJECTION.ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepositoryContact,
  ) {}

  async execute(pagination: PaginationDto) {
    const accounts = await this.accountRepository.getMany(pagination);

    return accounts;
  }
}
