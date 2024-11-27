import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { env } from '@utils';
import { UserModel } from 'src/Domain/Entities';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';
import { AuthModule } from './Modules/User/Auth.module';
import { RepositoryModule } from './Infra/Repositories/Repository.module';
import { UserModule } from './Modules/User/User.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10000,
          limit: 10,
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
      models: [UserModel],
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
    RepositoryModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
