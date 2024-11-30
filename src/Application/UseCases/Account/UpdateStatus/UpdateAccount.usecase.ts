import { ACCOUNT_STATUS, KEY_OF_INJECTION } from '@metadata';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PayloadType, ThrowErrorMessage } from '@types';
import { IAccountRepositoryContact } from 'src/Domain/Interfaces/Repositories/IAccount.repository-contract';
import { IUserRepositoryContract } from 'src/Domain/Interfaces/Repositories/IUser.repository-contract';
import { UpdateAccountDto } from './UpdateAccount.dto';

@Injectable()
export class UpdateAccountUseCase {
  constructor(
    @Inject(KEY_OF_INJECTION.USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryContract,
    @Inject(KEY_OF_INJECTION.ACCOUNT_REPOSITORY)
    private readonly accountRepository: IAccountRepositoryContact,
  ) {}

  async execute(
    payload: PayloadType,
    accountDto: UpdateAccountDto,
    accountId: string,
  ) {
    const user = await this.userRepository.getBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException({
        ptBr: 'usuário não cadastrado',
        enUs: 'unregistered user',
      } as ThrowErrorMessage);
    }

    if (
      accountDto.status !== ACCOUNT_STATUS.ACTIVE &&
      accountDto.status !== ACCOUNT_STATUS.INACTIVE
    ) {
      throw new BadRequestException({
        ptBr: 'status inválido',
        enUs: 'invalid status',
      } as ThrowErrorMessage);
    }

    const account = await this.accountRepository.getBy({
      id: accountId,
    });

    if (!account || account.userId !== payload.sub) {
      throw new NotFoundException({
        ptBr: 'conta não foi encontrada ou pertence a outro',
        enUs: 'account not found or not belong to you',
      } as ThrowErrorMessage);
    }

    const accountUpdated = await this.accountRepository.update(
      { id: accountId },
      {
        name: accountDto.name,
        status: accountDto.status,
        updatedAt: new Date(),
      },
    );

    return accountUpdated;
  }
}
