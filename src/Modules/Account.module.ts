import { Module } from '@nestjs/common';
import { CreateAccountUseCase } from 'src/Application/UseCases/Account/Create/CreateAccount.usecase';
import { AccountController } from 'src/Infra/Http/Controllers/Account.controller';
import { UserModule } from './User.module';
import { KEY_OF_INJECTION } from '@metadata';
import { AccountSequelizeRepository } from 'src/Infra/Repositories/Sequelize/AccountSequelize.repository';
import { AccountResolver } from 'src/Infra/Http/Graphql/Account.resolver';
import { GetManyAccountUseCase } from 'src/Application/UseCases/Account/GetMany/GetManyAccount.usecase';
import { UserSequelizeRepository } from 'src/Infra/Repositories/Sequelize/UserSequelize.repository';
import { GetAccountInformationUseCase } from 'src/Application/UseCases/Account/Informations/Informations.usecase';
import { TransactionSequelizeRepository } from 'src/Infra/Repositories/Sequelize/TransactionSequelize.repository';
import { UpdateAccountUseCase } from 'src/Application/UseCases/Account/UpdateStatus/UpdateAccount.usecase';

@Module({
  imports: [UserModule],
  controllers: [AccountController],
  providers: [
    {
      provide: KEY_OF_INJECTION.ACCOUNT_REPOSITORY,
      useClass: AccountSequelizeRepository,
    },
    {
      provide: KEY_OF_INJECTION.USER_REPOSITORY,
      useClass: UserSequelizeRepository,
    },
    {
      provide: KEY_OF_INJECTION.TRANSACTION_REPOSITORY,
      useClass: TransactionSequelizeRepository,
    },
    AccountResolver,

    // use cases
    CreateAccountUseCase,
    GetManyAccountUseCase,
    GetAccountInformationUseCase,
    UpdateAccountUseCase,
  ],
})
export class AccountModule {}
