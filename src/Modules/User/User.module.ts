import { KEY_OF_INJECTION } from '@metadata';
import { Module } from '@nestjs/common';
import { UserService } from 'src/Domain/Services/User.service';
import { UserController } from 'src/Infra/Http/Controllers/User.controller';
import { UserSequelizeRepository } from 'src/Infra/Repositories/User/UserSequelize.repository';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: KEY_OF_INJECTION.USER_REPOSITORY,
      useClass: UserSequelizeRepository,
    },
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
