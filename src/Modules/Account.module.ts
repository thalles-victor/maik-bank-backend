import { Module } from '@nestjs/common';
import { CreateAccountUseCase } from 'src/Application/UseCases/Account/Create/CreateAccount.usecase';
import { AccountController } from 'src/Infra/Http/Controllers/Account.controller';
import { UserModule } from './User.module';
import { KEY_OF_INJECTION } from '@metadata';
import { AccountSequelizeRepository } from 'src/Infra/Repositories/Sequelize/AccountSequelize.repository';
import { SelfDepositUseCase } from 'src/Application/UseCases/Account/SelfDeposit/SelfDeposit.usecase';

@Module({
  imports: [UserModule],
  controllers: [AccountController],
  providers: [
    {
      provide: KEY_OF_INJECTION.ACCOUNT_REPOSITORY,
      useClass: AccountSequelizeRepository,
    },
    CreateAccountUseCase,
    SelfDepositUseCase,
  ],
})
export class AccountModule {}
