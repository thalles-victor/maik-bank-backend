import 'dotenv/config';

import { env } from 'src/@shared/@utils';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
  });
  app.enableVersioning();

  const swaggerJsonDocument = fs.readFileSync(
    path.join(__dirname, '..', 'swagger.json'),
    'utf-8',
  );
  const swaggerDocument = JSON.parse(swaggerJsonDocument);
  SwaggerModule.setup('/api-docs', app, swaggerDocument);

  await app.listen(env.BACKEND_PORT ?? 3000);
}
bootstrap();
