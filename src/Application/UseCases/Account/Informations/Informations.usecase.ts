import { KEY_OF_INJECTION } from '@metadata';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  GetWithPaginationResult,
  PaginationProps,
  PayloadType,
  ThrowErrorMessage,
} from '@types';
import { TransactionAggregate } from 'src/Domain/Aggregates/Transactions.aggregate';
import { AccountModel } from 'src/Domain/Entities/Account.entity';
import { IAccountRepositoryContact } from 'src/Domain/Interfaces/Repositories/IAccount.repository-contract';
import { ITransactionRepositoryContract } from 'src/Domain/Interfaces/Repositories/ITransaction.repository-contract';
import { IUserRepositoryContract } from 'src/Domain/Interfaces/Repositories/IUser.repository-contract';

export interface GetAccountInformationUseCaseProps {
  accountId: string;
  transactionPagination: PaginationProps;
}

export interface GetAccountInformationUseCaseResult {
  account: AccountModel;
  transactions: GetWithPaginationResult<TransactionAggregate[]>;
}

@Injectable()
export class GetAccountInformationUseCase {
  constructor(
    @Inject(KEY_OF_INJECTION.USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_OF_INJECTION.ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepositoryContact,
    @Inject(KEY_OF_INJECTION.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepositoryContract,
  ) {}

  async execute(
    payload: PayloadType,
    { accountId, transactionPagination }: GetAccountInformationUseCaseProps,
  ): Promise<GetAccountInformationUseCaseResult> {
    const user = await this.userRepository.getBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException({
        ptBr: 'usuário não cadastrado',
        enUs: 'unregistered user',
      } as ThrowErrorMessage);
    }

    const account = (await this.accountRepository.getBy({ id: accountId }))
      .dataValues;

    if (!account || account.userId !== payload.sub) {
      throw new NotFoundException({
        ptBr: 'conta não foi encontrada ou não pertence a você',
        enUs: 'account not found or not belong to you',
      } as ThrowErrorMessage);
    }

    const { data, metadata } = await this.transactionRepository.getMany({
      ...transactionPagination,

      //!!!!SEMPRE DEIXE ESSE FILTRO AQUI EMBAIXO PARA EVITAR FALHA DE SEGURANÇA!!!!
      filters: {
        accountSenderId: accountId,
      },
    });

    return {
      account,
      transactions: {
        data,
        metadata,
      },
    };
  }
}
