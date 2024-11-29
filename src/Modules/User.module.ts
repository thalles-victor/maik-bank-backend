import { KEY_OF_INJECTION } from '@metadata';
import { Module } from '@nestjs/common';
import { UserService } from 'src/Domain/Services/User.service';
import { UserController } from 'src/Infra/Http/Controllers/User.controller';
import { UserResolver } from 'src/Infra/Http/Graphql/User.resolver';
import { UserSequelizeRepository } from 'src/Infra/Repositories/Sequelize/UserSequelize.repository';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: KEY_OF_INJECTION.USER_REPOSITORY,
      useClass: UserSequelizeRepository,
    },
    UserResolver,
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
