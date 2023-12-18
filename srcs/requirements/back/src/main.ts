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

  const config = new DocumentBuilder()
    .setTitle('API\'s route')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const server = express();
  server.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE'],
  }));

  app.use(cors())

  await app.listen(3000);
}

bootstrap();
