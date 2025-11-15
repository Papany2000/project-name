import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // Включаем ValidationPipe
  const config = new DocumentBuilder()
    .setTitle('Авторизация')
    .setDescription('Разработка приложения')
    .setVersion('1.0')
    .addTag('Auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);
  const configServiceInstance = app.get(ConfigService);
  const port = configServiceInstance.get<number>('PORT') || 5000;
  app.enableCors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If your frontend needs to send cookies/authentication
    allowedHeaders: 'Content-Type, Authorization, Accept',
  });
  await app.listen(port);
  Logger.log(`Server started at port ${port}`);
}
bootstrap();