import { KEY_OF_INJECTION } from '@metadata';
import { Module } from '@nestjs/common';
import { AuthSignUpUseCase } from 'src/Application/UseCases/Auth/sign-up/SignUp.usecase';
import { AuthController } from 'src/Infra/Http/Controllers/Auth.controller';
import { UserSequelizeRepository } from 'src/Infra/Repositories/User/UserSequelize.repository';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    {
      provide: KEY_OF_INJECTION.USER_REPOSITORY,
      useClass: UserSequelizeRepository,
    },
    AuthSignUpUseCase,
  ],
})
export class AuthModule {}