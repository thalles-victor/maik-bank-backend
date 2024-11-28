import { Global, Module } from '@nestjs/common';
import { UserSequelizeRepository } from './Sequelize/UserSequelize.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from '#models';
import { AccountModel } from 'src/Domain/Entities/Account.entity';
import { AccountSequelizeRepository } from './Sequelize/AccountSequelize.repository';
import { TransactionSequelizeRepository } from './Sequelize/TransactionSequelize.repository';
import { TransactionAggregate } from 'src/Domain/Aggregates/Transactions.aggregate';

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([UserModel, AccountModel, TransactionAggregate]),
  ],
  providers: [
    UserSequelizeRepository,
    AccountSequelizeRepository,
    TransactionSequelizeRepository,
  ],
  exports: [
    SequelizeModule,
    AccountSequelizeRepository,
    TransactionSequelizeRepository,
  ],
})
export class RepositoryModule {}
