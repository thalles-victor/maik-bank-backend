import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAccountDto } from './CreateAccount.dto';
import { AccountModel } from 'src/Domain/Entities/Account.entity';
import { shortId } from '@utils';
import { ACCOUNT_STATUS, KEY_OF_INJECTION } from '@metadata';
import { PayloadType, ThrowErrorMessage } from '@types';
import { UserService } from 'src/Domain/Services/User.service';
import { IAccountRepositoryContact } from 'src/Domain/Interfaces/Repositories/IAccount.repository-contract';

@Injectable()
export class CreateAccountUseCase {
  constructor(
    @Inject(KEY_OF_INJECTION.ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepositoryContact,
    private readonly userService: UserService,
  ) {}

  async execute(auth: PayloadType, { name }: CreateAccountDto) {
    const user = await this.userService.getBy({ id: auth.sub });

    if (!user) {
      throw new UnauthorizedException({
        ptBr: 'usuário não cadastrado',
        enUs: 'unregistered user',
      } as ThrowErrorMessage);
    }

    const newAccount = Object.assign(new AccountModel().dataValues, {
      id: shortId('shortOnly'),
      name: name,
      balance: 0,
      status: ACCOUNT_STATUS.ACTIVE,
      userId: user.id,
      email: user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: user,
    } as AccountModel);

    const accountCreated = await this.accountRepository.create(newAccount);

    return accountCreated;
  }
}
