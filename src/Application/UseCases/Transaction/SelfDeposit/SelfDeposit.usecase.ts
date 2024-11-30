import {
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SelfDepositDto } from './SelfDeposit.dto';
import {
  PayloadType,
  ThrowErrorMessage,
  TransactionUseCaseResult,
} from '@types';
import { UserService } from 'src/Domain/Services/User.service';
import {
  ACCOUNT_STATUS,
  KEY_OF_INJECTION,
  TransactionStatus,
  TypeOfTransaction,
} from '@metadata';
import { IAccountRepositoryContact } from 'src/Domain/Interfaces/Repositories/IAccount.repository-contract';
import { AccountUpdateModel } from 'src/Domain/Entities/Account.entity';
import { ITransactionRepositoryContract } from 'src/Domain/Interfaces/Repositories/ITransaction.repository-contract';
import { TransactionAggregate } from 'src/Domain/Aggregates/Transactions.aggregate';
import { shortId } from '@utils';
import { getTransactionVoucherUrl } from 'src/@shared/pdf/voucher';

@Injectable()
export class SelfDepositUseCase {
  constructor(
    @Inject(KEY_OF_INJECTION.ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepositoryContact,
    @Inject(KEY_OF_INJECTION.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepositoryContract,

    private readonly userService: UserService,
  ) {}

  async execute(
    auth: PayloadType,
    depositDto: SelfDepositDto,
  ): Promise<TransactionUseCaseResult> {
    const user = await this.userService.getBy({ id: auth.sub });

    if (!user) {
      throw new UnauthorizedException({
        ptBr: 'usuário não cadastrado',
        enUs: 'unregistered user',
      } as ThrowErrorMessage);
    }

    const account = await this.accountRepository.getBy({
      id: depositDto.accountId,
    });

    if (!account) {
      throw new NotFoundException({
        ptBr: 'esta conta não foi encontrada',
        enUs: 'this account was not found',
      } as ThrowErrorMessage);
    }

    if (account.isDeleted || account.status === ACCOUNT_STATUS.INACTIVE) {
      throw new NotAcceptableException({
        ptBr: 'essa conta foi deletada ou está inativa',
        enUs: 'this account has been deleted or is inactive',
      } as ThrowErrorMessage);
    }

    if (account.userId !== user.id) {
      throw new NotAcceptableException({
        ptBr: 'essa conta pertence a outra pessoa',
        enUs: 'this account belongs to someone else',
      });
    }

    const newTransaction = Object.assign(
      new TransactionAggregate().dataValues,
      {
        id: shortId('timestamp'),
        type: TypeOfTransaction.DEPOSIT,
        value: depositDto.value,
        accountTargetId: depositDto.accountId,
        accountSenderId: null,
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: TransactionStatus.PENDING,
      },
    );

    const transaction = await this.transactionRepository.create(newTransaction);

    try {
      const newBalance = account.balance + depositDto.value;

      const updateAccount = Object.assign(account.dataValues, {
        balance: newBalance,
        updatedAt: new Date(),
      } as AccountUpdateModel);

      const accountUpdated = (
        await this.accountRepository.update({ id: account.id }, updateAccount)
      ).dataValues;

      if (accountUpdated.balance !== newBalance) {
        throw new Error();
      }

      const successTransaction = await this.transactionRepository.update(
        {
          id: transaction.id,
        },
        {
          status: TransactionStatus.COMPLETED,
          updatedAt: new Date(),
        },
      );

      return {
        transaction: successTransaction,
        pdfVoucherUrl: getTransactionVoucherUrl(transaction.id),
      };
    } catch {
      const errorTransaction = await this.transactionRepository.update(
        {
          id: transaction.id,
        },
        {
          status: TransactionStatus.CANCELLED,
          updatedAt: new Date(),
        },
      );

      return {
        transaction: errorTransaction,
        pdfVoucherUrl: getTransactionVoucherUrl(transaction.id),
      };
    }
  }
}
