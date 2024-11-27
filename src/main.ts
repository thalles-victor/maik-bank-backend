import 'dotenv/config';
import { env } from 'src/@shared/@utils';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning();
  await app.listen(env.BACKEND_PORT ?? 3000);
}
bootstrap();
