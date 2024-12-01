import {
  ACCOUNT_STATUS,
  KEY_OF_INJECTION,
  TransactionStatus,
  TypeOfTransaction,
} from '@metadata';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ITransactionRepositoryContract } from 'src/Domain/Interfaces/Repositories/ITransaction.repository-contract';
import { TransferDto } from './Transfer.dto';
import {
  PayloadType,
  ThrowErrorMessage,
  TransactionUseCaseResult,
} from '@types';
import { IUserRepositoryContract } from 'src/Domain/Interfaces/Repositories/IUser.repository-contract';
import { IAccountRepositoryContact } from 'src/Domain/Interfaces/Repositories/IAccount.repository-contract';
import { TransactionAggregate } from 'src/Domain/Aggregates/Transactions.aggregate';
import { shortId } from '@utils';
import { getTransactionVoucherUrl } from 'src/@shared/pdf/voucher';
import { SendMailProducerService } from 'src/Infra/Jobs/Producers/Job.Producer';

@Injectable()
export class TransferUseCase {
  constructor(
    @Inject(KEY_OF_INJECTION.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepositoryContract,
    @Inject(KEY_OF_INJECTION.USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_OF_INJECTION.ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepositoryContact,
    private readonly sendMailQueueService: SendMailProducerService,
  ) {}

  async execute(
    auth: PayloadType,
    transferDto: TransferDto,
  ): Promise<TransactionUseCaseResult> {
    const user = await this.userRepository.getBy({ id: auth.sub });

    if (!user) {
      throw new UnauthorizedException({
        ptBr: 'usuário não cadastrado',
        enUs: 'unregistered user',
      } as ThrowErrorMessage);
    }

    if (transferDto.senderId === transferDto.targetId) {
      throw new NotAcceptableException({
        ptBr: 'o remetente e destinatários são os mesmos',
        enUs: 'senders and recipients are the same',
      } as ThrowErrorMessage);
    }

    const senderAccount = await this.accountRepository.getBy({
      id: transferDto.senderId,
    });

    if (!senderAccount || senderAccount.userId !== auth.sub) {
      throw new ForbiddenException({
        ptBr: 'essa conta não existe ou não pertence a você',
        enUs: 'This account does not exist or does not belong to you',
      } as ThrowErrorMessage);
    }

    if (
      senderAccount.isDeleted ||
      senderAccount.status === ACCOUNT_STATUS.INACTIVE
    ) {
      throw new ForbiddenException({
        ptBr: 'sua conta foi deletada ou está inativa',
        enUs: 'your account has been deleted or is inactive',
      } as ThrowErrorMessage);
    }

    if (senderAccount.balance < transferDto.value) {
      throw new ForbiddenException({
        ptBr: 'saldo insuficiente para transferir',
        enUs: 'insufficient balance to transfer',
      } as ThrowErrorMessage);
    }

    const targetAccount = await this.accountRepository.getBy({
      id: transferDto.targetId,
    });

    if (!targetAccount) {
      throw new NotFoundException({
        ptBr: 'conta de envio não encontrada',
        enUs: 'shipping account not found',
      } as ThrowErrorMessage);
    }

    if (
      targetAccount.isDeleted ||
      targetAccount.status === ACCOUNT_STATUS.INACTIVE
    ) {
      throw new NotAcceptableException({
        ptBr: 'não está permitido fazer transferência para conta destinatária',
        enUs: "It is not allowed to make transfers to the recipient's account",
      } as ThrowErrorMessage);
    }

    const newTransaction = Object.assign(
      new TransactionAggregate().dataValues,
      {
        id: shortId('timestamp'),
        type: TypeOfTransaction.TRANSFER,
        value: transferDto.value,
        accountTargetId: transferDto.targetId,
        accountSenderId: transferDto.senderId,
        description: transferDto.description ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: TransactionStatus.PENDING,
      },
    );

    const transaction = await this.transactionRepository.create(newTransaction);

    try {
      const transactionUpdated = await this.transactionRepository.transfer({
        senderId: transferDto.senderId,
        targetId: transferDto.targetId,
        value: transferDto.value,
        transactionId: transaction.dataValues.id,
      });

      // send mail

      await this.sendMailQueueService.transactionSendEmail({
        users: [
          {
            name: 'reciver',
            email: targetAccount.email,
          },
          {
            name: 'sender',
            email: senderAccount.email,
          },
        ],
        transaction: transactionUpdated,
      });
      return {
        transaction: transactionUpdated,
        pdfVoucherUrl: getTransactionVoucherUrl(transactionUpdated.id),
      };
    } catch (error) {
      console.log(error);

      const canceledTransaction = await this.transactionRepository.update(
        { id: transaction.id },
        { status: TransactionStatus.CANCELLED, updatedAt: new Date() },
      );

      return {
        transaction: canceledTransaction,
        pdfVoucherUrl: getTransactionVoucherUrl(canceledTransaction.id),
      };
    }
  }
}
