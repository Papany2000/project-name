import { Module } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { VacanciesController } from './vacancies.controller';
import { Vacancies } from './vacancies.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  providers: [VacanciesService],
  controllers: [VacanciesController],
  imports: [SequelizeModule.forFeature([Vacancies])]
})
export class VacanciesModule {}
