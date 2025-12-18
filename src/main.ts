import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { corsOptions } from './configurations/cors.config';

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
  
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000'];

  app.enableCors(corsOptions);
  
  await app.listen(port);
  Logger.log(`Server started at port ${port}`);
}
bootstrap();