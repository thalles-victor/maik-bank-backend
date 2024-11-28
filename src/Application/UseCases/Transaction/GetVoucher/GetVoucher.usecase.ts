import { KEY_OF_INJECTION } from '@metadata';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PayloadType, ThrowErrorMessage } from '@types';
import { IAccountRepositoryContact } from 'src/Domain/Interfaces/Repositories/IAccount.repository-contract';
import { ITransactionRepositoryContract } from 'src/Domain/Interfaces/Repositories/ITransaction.repository-contract';
import { IUserRepositoryContract } from 'src/Domain/Interfaces/Repositories/IUser.repository-contract';
import { PdfService } from 'src/Domain/Services/Pdf.service';

@Injectable()
export class GetVoucherUseCase {
  constructor(
    @Inject(KEY_OF_INJECTION.USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_OF_INJECTION.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepositoryContract,
    @Inject(KEY_OF_INJECTION.ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepositoryContact,
    private readonly pdfService: PdfService,
  ) {}

  async execute(auth: PayloadType, transactionId: string) {
    const user = await this.userRepository.getBy({ id: auth.sub });

    if (!user) {
      throw new UnauthorizedException({
        ptBr: 'usuário não cadastrado',
        enUs: 'unregistered user',
      } as ThrowErrorMessage);
    }

    const transaction = await this.transactionRepository.getBy({
      id: transactionId,
    });

    if (!transaction) {
      throw new NotFoundException({
        ptBr: 'transação não encontrada',
        enUs: 'transaction not found',
      } as ThrowErrorMessage);
    }

    const account = await this.accountRepository.getBy({
      id: transaction.accountSenderId,
    });

    if (!account) {
      throw new NotFoundException({
        ptBr: 'conta não encontrada',
        enUs: 'account not found',
      } as ThrowErrorMessage);
    }

    console.log(account.dataValues.userId);

    if (auth.sub !== account.dataValues.userId) {
      throw new NotFoundException({
        ptBr: 'transação não encontrada',
        enUs: 'transaction not found',
      } as ThrowErrorMessage);
    }

    const pdfStream = this.pdfService.generateTransactionPdf(transaction);

    return pdfStream;
  }
}
