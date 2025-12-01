import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateOporaDto } from './dto/create-opora.dto';
import { UpdateOporaDto } from './dto/update-opora.dto';
import { MinioService } from '../minio/minio.service';
import { Express } from 'express';
import { Opora } from './opora.model';
import { Photo } from './opora.photo.model';

@Injectable()
export class OporaService {
    constructor(
        @InjectModel(Opora)
        private oporaModel: typeof Opora,
        @InjectModel(Photo)
        private photoModel: typeof Photo,
        private minioService: MinioService,
    ) { }

    async create(createOporaDto: CreateOporaDto): Promise<Opora> {
        const existingOpora = await this.oporaModel.findOne({
            where: { oporaId: createOporaDto.oporaId },
        });

        if (existingOpora) {
            throw new BadRequestException(`Опora с ID ${createOporaDto.oporaId} уже существует`);
        }

        return this.oporaModel.create(createOporaDto as any);
    }

    async findAll(): Promise<Opora[]> {
        return this.oporaModel.findAll({
            include: [Photo],
            order: [['createdAt', 'DESC']],
        });
    }

    async findOne(id: number): Promise<Opora> {
        const opora = await this.oporaModel.findByPk(id, {
            include: [Photo],
        });

        if (!opora) {
            throw new NotFoundException(`Опora с ID ${id} не найдена`);
        }

        return opora;
    }

    async findByOporaId(oporaId: string): Promise<Opora> {
        const opora = await this.oporaModel.findOne({
            where: { oporaId },
            include: [Photo],
        });

        if (!opora) {
            throw new NotFoundException(`Опora с идентификатором ${oporaId} не найдена`);
        }

        return opora;
    }

    async update(id: number, updateOporaDto: UpdateOporaDto): Promise<Opora> {
        const opora = await this.findOne(id);

        const updateData: any = {};
        Object.keys(updateOporaDto).forEach(key => {
            if (updateOporaDto[key] !== undefined) {
                updateData[key] = updateOporaDto[key];
            }
        });

        return opora.update(updateData);
    }

    async remove(id: number): Promise<void> {
        const opora = await this.findOne(id);

        // Безопасная проверка перед итерацией
        if (opora.photos && Array.isArray(opora.photos)) {
            for (const photo of opora.photos) {
                if (photo && photo.filename) {
                    await this.minioService.deleteFile(photo.filename);
                }
            }
        }

        await opora.destroy();
    }

    async addPhotos(oporaId: string, files: Express.Multer.File[]): Promise<Opora> {
        const opora = await this.findByOporaId(oporaId);

        for (const file of files) {
            const uploadResult = await this.minioService.uploadFile(file, oporaId);

            await this.photoModel.create({
                filename: uploadResult.filename,
                originalName: file.originalname,
                url: uploadResult.url,
                size: file.size,
                mimetype: file.mimetype,
                uploadedAt: new Date(),
                oporaId: opora.id,
            });
        }

        return this.findByOporaId(oporaId);
    }

    async removePhoto(oporaId: string, photoFilename: string): Promise<Opora> {
        const opora = await this.findByOporaId(oporaId);

        const photo = await this.photoModel.findOne({
            where: {
                oporaId: opora.id,
                filename: photoFilename,
            },
        });

        if (!photo) {
            throw new NotFoundException(`Фото с именем ${photoFilename} не найдено`);
        }

        await this.minioService.deleteFile(photoFilename);
        await photo.destroy();

        return this.findByOporaId(oporaId);
    }

    async findByStatus(status: string): Promise<Opora[]> {
        return this.oporaModel.findAll({
            where: { status },
            include: [Photo],
        });
    }
}
