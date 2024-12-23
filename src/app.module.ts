import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { env } from '@utils';
import { UserModel } from 'src/Domain/Entities';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';
import { AuthModule } from './Modules/Auth.module';
import { RepositoryModule } from './Infra/Repositories/Repository.module';
import { UserModule } from './Modules/User.module';
import { JwtModule } from '@nestjs/jwt';
import { AccountModel } from './Domain/Entities/Account.entity';
import { AccountModule } from './Modules/Account.module';
import { TransactionAggregate } from './Domain/Aggregates/Transactions.aggregate';
import { TransactionModule } from './Modules/Transaction.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CustomThrottlerGuard } from './@shared/@guards/custom-throttler.guard';
import { BullModule } from '@nestjs/bullmq';
import { JobsModules } from './Infra/Jobs/Jobs.module';
import * as path from 'node:path';

@Module({
  imports: [
    JobsModules,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
      csrfPrevention: false, //Nao é recomendado, o cerso seria enviar os headers na requisição
      playground: true,
      introspection: true,
      context: ({ req, res }) => ({ req, res }),
    }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 6000,
          limit: 5,
        },
      ],
      storage: new ThrottlerStorageRedisService(
        new Redis({
          host: env.REDIS_HOST,
          port: env.REDIS_PORT,
          password: env.REDIS_PASSWORD,
        }),
      ),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: env.POSTGRES_HOST,
      port: env.POSTGRES_PORT,
      username: env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD,
      database: env.POSTGRES_DB,
      models: [UserModel, AccountModel, TransactionAggregate],
    }),
    JwtModule.register({
      global: true, // compartilha o módulo e as configurações para toda a aplicação
      secret: env.JWT_SECRET,
      signOptions: {
        expiresIn: '24h',
      },
      verifyOptions: {
        ignoreExpiration: false,
      },
    }),
    BullModule.forRoot({
      connection: {
        host: env.REDIS_HOST,
        password: env.REDIS_PASSWORD,
        port: env.REDIS_PORT,
      },
    }),

    RepositoryModule,
    AuthModule,
    UserModule,
    AccountModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true, // Transforma os parâmetros automaticamente
        whitelist: true, // Remove campos não validados
      }),
    },
    AppService,
  ],
})
export class AppModule {}
