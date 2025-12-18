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
import { VacanciesModule } from './vacancies/vacancies.module';
import { OporaModule } from './opora/opora.module';
import { MinioModule } from './minio/minio.module';
import { ProjectsModule } from './projects/projects.module';



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
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        autoLoadModels: true, // Автоматическая загрузка моделей
        // synchronize: false, // Отключим автоматическую синхронизацию (используем миграции!)
        models: [User, RefreshToken],
      }),
    }),
    AuthModule,
    UsersModule,
    VacanciesModule,
    MinioModule,
    OporaModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
