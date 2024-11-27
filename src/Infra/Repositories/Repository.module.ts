import { Global, Module } from '@nestjs/common';
import { UserSequelizeRepository } from './User/UserSequelize.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from '#models';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  providers: [UserSequelizeRepository],
  exports: [SequelizeModule],
})
export class RepositoryModule {}
