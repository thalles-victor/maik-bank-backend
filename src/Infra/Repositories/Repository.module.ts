import { Global, Module } from '@nestjs/common';
import { UserSequelizeRepository } from './User/UserSequelize.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from '#models';
import { AccountModel } from 'src/Domain/Entities/Account.entity';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([UserModel, AccountModel])],
  providers: [UserSequelizeRepository],
  exports: [SequelizeModule],
})
export class RepositoryModule {}
