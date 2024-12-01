import 'dotenv/config';
import { env } from 'src/@shared/@utils';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as swaggerUi from 'swagger-ui-express';
import { ValidationPipe } from '@nestjs/common';
import SwaggerJson from '../swagger.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // const swaggerFile = path.join(__dirname, '..', 'swagger.yaml');
  // console.log(swaggerFile);
  // const swaggerDocument = fs.readFileSync(swaggerFile, 'utf8');
  // const swaggerJSON = JSON.parse(JSON.stringify(swaggerDocument));

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(SwaggerJson));

  app.enableVersioning();
  await app.listen(env.BACKEND_PORT ?? 3000);
}
bootstrap();
