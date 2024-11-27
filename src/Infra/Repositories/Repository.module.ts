import { Global, Module } from '@nestjs/common';
import { UserSequelizeRepository } from './Sequelize/UserSequelize.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from '#models';
import { AccountModel } from 'src/Domain/Entities/Account.entity';
import { AccountSequelizeRepository } from './Sequelize/AccountSequelize.repository';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([UserModel, AccountModel])],
  providers: [UserSequelizeRepository, AccountSequelizeRepository],
  exports: [SequelizeModule, AccountSequelizeRepository],
})
export class RepositoryModule {}
