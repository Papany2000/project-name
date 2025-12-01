import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OporaService } from './opora.service';
import { OporaController } from './opora.controller';

import { MinioModule } from '../minio/minio.module';
import { Opora } from './opora.model';
import { Photo } from './opora.photo.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Opora, Photo]),
    MinioModule,
  ],
  controllers: [OporaController],
  providers: [OporaService],
  exports: [OporaService],
})
export class OporaModule { }
