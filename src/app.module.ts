import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { env } from '@utils';
import { UserModel } from '#models';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: env.POSTGRES_HOST,
      port: env.POSTGRES_PORT,
      username: env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD,
      database: env.POSTGRES_DB,
      models: [UserModel],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
