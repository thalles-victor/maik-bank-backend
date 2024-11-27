import {
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SelfDepositDto } from './SelfDeposit.dto';
import { PayloadType, ThrowErrorMessage } from '@types';
import { UserService } from 'src/Domain/Services/User.service';
import { ACCOUNT_STATUS, KEY_OF_INJECTION } from '@metadata';
import { IAccountRepositoryContact } from 'src/Domain/Interfaces/Repositories/IAccount.repository-contract';
import { AccountUpdateModel } from 'src/Domain/Entities/Account.entity';

@Injectable()
export class SelfDepositUseCase {
  constructor(
    @Inject(KEY_OF_INJECTION.ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepositoryContact,
    private readonly userService: UserService,
  ) {}

  async execute(auth: PayloadType, depositDto: SelfDepositDto) {
    const user = await this.userService.getBy({ id: auth.sub });

    console.log(depositDto);
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

    const updateAccount = Object.assign(account.dataValues, {
      balance: account.balance + depositDto.amount,
    } as AccountUpdateModel);

    const accountUpdated = await this.accountRepository.update(
      { id: account.id },
      updateAccount,
    );

    return accountUpdated;
  }
}
