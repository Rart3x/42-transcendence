import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';


async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./secret/key.pem'),
    cert: fs.readFileSync('./secret/cert.pem'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
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
  app.init();


  await app.listen(3000);

}

bootstrap();