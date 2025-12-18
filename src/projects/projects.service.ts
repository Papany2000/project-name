// projects.service.ts - адаптированный для вашего MinioService
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsRepository } from './projects.repository';
import { MinioService } from '../minio/minio.service';


@Injectable()
export class ProjectsService {
    private readonly logger = new Logger(ProjectsService.name);

    constructor(
        private readonly projectsRepository: ProjectsRepository,
        private readonly minioService: MinioService,
    ) { }

    async create(createProjectDto: CreateProjectDto) {
        return this.projectsRepository.create(createProjectDto);
    }

    async findAll() {
        return this.projectsRepository.findAll();
    }

    async findOne(id: number) {
        const project = await this.projectsRepository.findOne(id);
        if (!project) {
            throw new NotFoundException(`Проект с ID ${id} не найден`);
        }
        return project;
    }

    async update(id: number, updateProjectDto: UpdateProjectDto) {
        const [affectedCount] = await this.projectsRepository.update(id, updateProjectDto);
        if (affectedCount === 0) {
            throw new NotFoundException(`Проект с ID ${id} не найден`);
        }
        return this.projectsRepository.findOne(id);
    }

    async remove(id: number) {
        const project = await this.findOne(id);

        // Удаляем файл из MinIO если он есть
        if (project.foto) {
            try {
                await this.minioService.deleteFile(project.foto);
            } catch (error) {
                this.logger.error(`Ошибка удаления файла из MinIO: ${error.message}`);
            }
        }

        const deletedCount = await this.projectsRepository.remove(id);
        if (deletedCount === 0) {
            throw new NotFoundException(`Проект с ID ${id} не найден`);
        }
        return { message: 'Проект успешно удален' };
    }

    async uploadFile(id: number, file: Express.Multer.File) {
        const project = await this.findOne(id);

        // Удаляем старый файл если он есть
        if (project.foto) {
            try {
                await this.minioService.deleteFile(project.foto);
            } catch (error) {
                this.logger.error(`Ошибка удаления старого файла: ${error.message}`);
            }
        }

        // Используем метод uploadProjectFile для загрузки
        const uploadResult = await this.minioService.uploadProjectFile(file, id);

        // Обновляем информацию о файле в БД
        const [affectedCount] = await this.projectsRepository.updateWithFile(id, {
            foto: uploadResult.filename,
            originalFilename: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
        });

        if (affectedCount === 0) {
            throw new BadRequestException('Не удалось обновить информацию о файле');
        }

        return this.getProjectWithUrl(id);
    }

    async getFileUrl(id: number): Promise<string | null> {
        const project = await this.findOne(id);

        if (!project.foto) {
            return null;
        }

        try {
            // Получаем подписанный URL
            return await this.minioService.getFileUrl(project.foto);
        } catch (error) {
            this.logger.error(`Ошибка получения URL файла: ${error.message}`);
            // В случае ошибки возвращаем публичный URL
            return this.minioService.getPublicUrl(project.foto);
        }
    }

    async deleteFile(id: number) {
        const project = await this.findOne(id);

        if (!project.foto) {
            throw new BadRequestException('У проекта нет прикрепленного файла');
        }

        // Удаляем файл из MinIO
        await this.minioService.deleteFile(project.foto);

        // Обновляем запись в БД
        const [affectedCount] = await this.projectsRepository.deleteFile(id);

        if (affectedCount === 0) {
            throw new BadRequestException('Не удалось удалить информацию о файле');
        }

        return { message: 'Файл успешно удален' };
    }

    async getProjectWithUrl(id: number) {
        const project = await this.findOne(id);
        const projectData = project.toJSON();

        let fotoUrl: string | null = null; // Явно указываем тип
        if (project.foto) {
            try {
                fotoUrl = await this.getFileUrl(id);
            } catch (error) {
                this.logger.error(`Ошибка получения URL для проекта ${id}: ${error.message}`);
            }
        }

        return {
            ...projectData,
            foto_url: fotoUrl,
        };
    }
}
