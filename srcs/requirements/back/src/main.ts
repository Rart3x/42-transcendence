import { AppModule } from './app.module';
import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

var cors = require('cors')

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());

  app.enableCors({
    origin: '*',
    credentials: true,
  });
  
  const config = new DocumentBuilder()
    .setTitle('API\'s route')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const server = express();

  app.use(cors())

  // app.use('/images', express.static('public/images'));

  await app.listen(3000);
}

bootstrap();
