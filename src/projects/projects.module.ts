// src/projects/projects.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';

import { MinioModule } from '../minio/minio.module';
import { Project } from './projects.model';
import { ProjectsRepository } from './projects.repository';


@Module({
  imports: [
    SequelizeModule.forFeature([Project]),
    MinioModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository],
  exports: [ProjectsService],
})
export class ProjectsModule { }