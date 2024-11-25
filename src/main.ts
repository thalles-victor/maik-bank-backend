import 'dotenv/config';
import { env } from '@utils';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(env.BACKEND_PORT ?? 3000);
}
bootstrap();
