import { KEY_OF_INJECTION } from '@metadata';
import { Module } from '@nestjs/common';
import { GetVoucherUseCase } from 'src/Application/UseCases/Transaction/GetVoucher/GetVoucher.usecase';
import { TransferUseCase } from 'src/Application/UseCases/Transaction/Transfer/Transfer.usecase';
import { PdfService } from 'src/Domain/Services/Pdf.service';
import { TransactionController } from 'src/Infra/Http/Controllers/Transaction.controller';
import { AccountSequelizeRepository } from 'src/Infra/Repositories/Sequelize/AccountSequelize.repository';
import { TransactionSequelizeRepository } from 'src/Infra/Repositories/Sequelize/TransactionSequelize.repository';
import { UserSequelizeRepository } from 'src/Infra/Repositories/Sequelize/UserSequelize.repository';

@Module({
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
    PdfService,

    // use cases
    TransferUseCase,
    GetVoucherUseCase,
  ],
})
export class TransactionModule {}
