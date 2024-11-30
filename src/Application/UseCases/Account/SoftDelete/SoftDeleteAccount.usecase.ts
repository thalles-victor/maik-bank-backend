import { KEY_OF_INJECTION } from '@metadata';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PayloadType, ThrowErrorMessage } from '@types';
import { IAccountRepositoryContact } from 'src/Domain/Interfaces/Repositories/IAccount.repository-contract';
import { IUserRepositoryContract } from 'src/Domain/Interfaces/Repositories/IUser.repository-contract';

@Injectable()
export class SoftDeleteAccountUseCase {
  constructor(
    @Inject(KEY_OF_INJECTION.USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_OF_INJECTION.ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepositoryContact,
  ) {}

  async execute(payload: PayloadType, accountId: string) {
    const user = await this.userRepository.getBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException({
        ptBr: 'usuário não cadastrado',
        enUs: 'unregistered user',
      } as ThrowErrorMessage);
    }

    const account = await this.accountRepository.getBy({ id: accountId });

    if (!account) {
      throw new NotFoundException({
        ptBr: 'conta não foi encontrada',
        enUs: 'account not found',
      } as ThrowErrorMessage);
    }

    const accountUpdated = await this.accountRepository.update(
      {
        id: accountId,
      },
      {
        isDeleted: true,
      },
    );

    return accountUpdated;
  }
}
