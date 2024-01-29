import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({disableErrorMessages: false}));

  app.enableCors({
    origin:'*',
    credentials: true,
  });

  app.use(cookieParser());

  app.enableCors();
  
  const config = new DocumentBuilder()
    .setTitle('API\'s route')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(3000);
}

bootstrap();