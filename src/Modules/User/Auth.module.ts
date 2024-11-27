import { KEY_OF_INJECTION } from '@metadata';
import { Module } from '@nestjs/common';
import { AuthSignUpUseCase } from 'src/Application/UseCases/Auth/sign-up/SignUp.usecase';
import { AuthController } from 'src/Infra/Http/Controllers/Auth.controller';
import { UserSequelizeRepository } from 'src/Infra/Repositories/User/UserSequelize.repository';
import { UserModule } from './User.module';
import { AuthSignInUseCase } from 'src/Application/UseCases/Auth/Sign-in/SignIn.usecase';
import { AuthCurrent } from 'src/Application/UseCases/Auth/Current/Current.usecase';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    {
      provide: KEY_OF_INJECTION.USER_REPOSITORY,
      useClass: UserSequelizeRepository,
    },
    AuthSignUpUseCase,
    AuthSignInUseCase,
    AuthCurrent,
  ],
})
export class AuthModule {}
