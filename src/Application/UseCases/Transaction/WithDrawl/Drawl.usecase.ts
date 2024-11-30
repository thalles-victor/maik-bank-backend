import {
  ForbiddenException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DrawlDto } from './Drawl.dto';
import {
  PayloadType,
  ThrowErrorMessage,
  TransactionUseCaseResult,
} from '@types';
import {
  ACCOUNT_STATUS,
  KEY_OF_INJECTION,
  TransactionStatus,
  TypeOfTransaction,
} from '@metadata';
import { IUserRepositoryContract } from 'src/Domain/Interfaces/Repositories/IUser.repository-contract';
import { IAccountRepositoryContact } from 'src/Domain/Interfaces/Repositories/IAccount.repository-contract';
import { ITransactionRepositoryContract } from 'src/Domain/Interfaces/Repositories/ITransaction.repository-contract';
import {
  TransactionAggregate,
  TransactionUpdateAggregate,
} from 'src/Domain/Aggregates/Transactions.aggregate';
import { shortId } from '@utils';
import { getTransactionVoucherUrl } from 'src/@shared/pdf/voucher';

@Injectable()
export class WithdrawalUseCase {
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
    drawlDto: DrawlDto,
  ): Promise<TransactionUseCaseResult> {
    const user = await this.userRepository.getBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException({
        ptBr: 'usuário não cadastrado',
        enUs: 'unregistered user',
      } as ThrowErrorMessage);
    }

    const account = await this.accountRepository.getBy({
      id: drawlDto.accountId,
    });

    if (!account) {
      throw new NotFoundException({
        ptBr: 'conta não encontrada ou não existe',
        enUs: 'not found account or not exist',
      } as ThrowErrorMessage);
    }

    if (account.userId !== payload.sub) {
      throw new ForbiddenException({
        ptBr: 'está conta pertence a outra pessoa',
        enUs: 'this account belong to other people',
      } as ThrowErrorMessage);
    }

    if (account.isDeleted || account.status === ACCOUNT_STATUS.INACTIVE) {
      throw new NotAcceptableException({
        ptBr: 'esta conta está inativa ou foi deletada',
        enUs: 'this account is inactive or was deleted',
      } as ThrowErrorMessage);
    }

    if (account.balance < drawlDto.value) {
      throw new NotAcceptableException({
        ptBr: 'saldo para saque insuficiente',
        enUs: 'Insufficient withdrawal balance',
      } as ThrowErrorMessage);
    }

    const newTransaction = Object.assign(
      new TransactionAggregate().dataValues,
      {
        id: shortId('timestamp'),
        type: TypeOfTransaction.WITHDRAW,
        value: drawlDto.value,
        accountTargetId: drawlDto.accountId,
        accountSenderId: null,
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: TransactionStatus.PENDING,
      },
    );

    const transaction = (
      await this.transactionRepository.create(newTransaction)
    ).dataValues;

    try {
      const newBalance = account.balance - drawlDto.value;

      const accountUpdated = await this.accountRepository.update(
        {
          id: drawlDto.accountId,
        },
        { balance: newBalance, updatedAt: new Date() },
      );

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
        pdfVoucherUrl: getTransactionVoucherUrl(transaction.id),
        transaction: successTransaction,
      };
    } catch {
      const updateTransactionError = Object.assign(transaction, {
        status: TransactionStatus.CANCELLED,
        updatedAt: new Date(),
      } as TransactionUpdateAggregate);

      const transactionError = await this.transactionRepository.update(
        { id: transaction.id },
        updateTransactionError,
      );

      return {
        transaction: transactionError,
        pdfVoucherUrl: getTransactionVoucherUrl(transaction.id),
      };
    }
  }
}
