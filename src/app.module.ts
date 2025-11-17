import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './configurations/app-config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.model';
import { RefreshToken } from './auth/models/refresh-token.model';



@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig], //Импортируем файл конфигурации
      isGlobal: true,
    }),
    // регистрируем модуль для асинхронной работы с базой данных
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'postgres',
<<<<<<< HEAD
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
=======
        host: configService.get('DB_HOST') || 'localhost',
        port: configService.get('DB_PORT') || 5432,
        username: configService.get('DB_USER') || '*****',
        password: configService.get('DB_PASSWORD') || '*****&',
        database: configService.get('DB_NAME') || 'Sait-project',
>>>>>>> b0fdc5bf3447f3d92348654ad9f3cdf073168cf4
        autoLoadModels: true, // Автоматическая загрузка моделей
        // synchronize: false, // Отключим автоматическую синхронизацию (используем миграции!)
        models: [User, RefreshToken],
      }),
    }),
    AuthModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
