import { KEY_OF_INJECTION } from '@metadata';
import { Module } from '@nestjs/common';
import { GetVoucherUseCase } from 'src/Application/UseCases/Transaction/GetVoucher/GetVoucher.usecase';
import { SelfDepositUseCase } from 'src/Application/UseCases/Transaction/SelfDeposit/SelfDeposit.usecase';
import { TransferUseCase } from 'src/Application/UseCases/Transaction/Transfer/Transfer.usecase';
import { PdfService } from 'src/Domain/Services/Pdf.service';
import { TransactionController } from 'src/Infra/Http/Controllers/Transaction.controller';
import { AccountSequelizeRepository } from 'src/Infra/Repositories/Sequelize/AccountSequelize.repository';
import { TransactionSequelizeRepository } from 'src/Infra/Repositories/Sequelize/TransactionSequelize.repository';
import { UserSequelizeRepository } from 'src/Infra/Repositories/Sequelize/UserSequelize.repository';
import { UserModule } from './User.module';
import { TransactionResolver } from 'src/Infra/Http/Graphql/Transaction.resolver';
import { WithdrawalUseCase } from 'src/Application/UseCases/Transaction/WithDrawl/Drawl.usecase';
import { TransactionService } from 'src/Domain/Services/Transaction.service';
import { SendMailProducerService } from 'src/Infra/Jobs/Producers/Job.Producer';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: KEY_OF_INJECTION.EMAIL_QUEUE,
    }),
    UserModule,
  ],
  controllers: [TransactionController],
  providers: [
    {
      provide: KEY_OF_INJECTION.TRANSACTION_REPOSITORY,
      useClass: TransactionSequelizeRepository,
    },
    {
      provide: KEY_OF_INJECTION.USER_REPOSITORY,
      useClass: UserSequelizeRepository,
    },
    {
      provide: KEY_OF_INJECTION.ACCOUNT_REPOSITORY,
      useClass: AccountSequelizeRepository,
    },
    TransactionResolver,

    // services
    PdfService,
    TransactionService,

    // use cases
    TransferUseCase,
    GetVoucherUseCase,
    SelfDepositUseCase,
    WithdrawalUseCase,
    SendMailProducerService,
  ],
})
export class TransactionModule {}
