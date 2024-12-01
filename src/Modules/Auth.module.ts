import { KEY_OF_INJECTION } from '@metadata';
import { Module } from '@nestjs/common';
import { AuthSignUpUseCase } from 'src/Application/UseCases/Auth/sign-up/SignUp.usecase';
import { AuthController } from 'src/Infra/Http/Controllers/Auth.controller';
import { UserSequelizeRepository } from 'src/Infra/Repositories/Sequelize/UserSequelize.repository';
import { AuthSignInUseCase } from 'src/Application/UseCases/Auth/Sign-in/SignIn.usecase';
import { AuthCurrent } from 'src/Application/UseCases/Auth/Current/Current.usecase';
import { UserModule } from './User.module';
import { AuthResolver } from 'src/Infra/Http/Graphql/Auth.resolver';
import { SendMailProducerService } from 'src/Infra/Jobs/Producers/Job.Producer';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: KEY_OF_INJECTION.EMAIL_QUEUE,
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: KEY_OF_INJECTION.USER_REPOSITORY,
      useClass: UserSequelizeRepository,
    },
    AuthResolver,
    AuthSignUpUseCase,
    AuthSignInUseCase,
    AuthCurrent,
    SendMailProducerService,
  ],
})
export class AuthModule {}
