import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
    private readonly logger = new Logger(MinioService.name);
    private minioClient: Minio.Client;
    private bucketName: string;

    constructor(private configService: ConfigService) {
        const endPoint = this.configService.get<string>('MINIO_ENDPOINT') || 'localhost';
        const port = parseInt(this.configService.get<string>('MINIO_PORT') || '9000');
        const useSSL = this.configService.get<string>('MINIO_USE_SSL') === 'true';
        const accessKey = this.configService.get<string>('MINIO_ACCESS_KEY') || 'admin';
        const secretKey = this.configService.get<string>('MINIO_SECRET_KEY') || 'password';

        this.minioClient = new Minio.Client({
            endPoint,
            port,
            useSSL,
            accessKey,
            secretKey,
        });

        // Используем существующую конфигурацию
        this.bucketName = this.configService.get<string>('MINIO_BUCKET') || 'opora-photos';
    }

    async onModuleInit() {
        await this.createBucketIfNotExists();
    }

    private async createBucketIfNotExists() {
        try {
            const exists = await this.minioClient.bucketExists(this.bucketName);
            if (!exists) {
                await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
                this.logger.log(`Bucket ${this.bucketName} created successfully`);
            }
        } catch (error) {
            this.logger.error('Error creating bucket:', error);
        }
    }

    // Существующий метод
    async uploadFile(file: Express.Multer.File, oporaId: string): Promise<{ filename: string; url: string }> {
        const filename = `opora-${oporaId}-${Date.now()}-${file.originalname}`;

        await this.minioClient.putObject(
            this.bucketName,
            filename,
            file.buffer,
            file.size,
            {
                'Content-Type': file.mimetype,
            },
        );

        const url = `http://${this.configService.get('MINIO_ENDPOINT') || 'localhost'}:${this.configService.get('MINIO_PORT') || 9000}/${this.bucketName}/${filename}`;

        return {
            filename,
            url,
        };
    }

    // Существующий метод
    async deleteFile(filename: string): Promise<void> {
        await this.minioClient.removeObject(this.bucketName, filename);
    }

    // НОВЫЕ МЕТОДЫ ДЛЯ ПРОЕКТОВ:

    /**
     * Получить подписанный URL для файла
     * @param filename имя файла в MinIO
     * @param expirySeconds время жизни URL в секундах (по умолчанию 7 дней)
     */
    async getFileUrl(filename: string, expirySeconds: number = 604800): Promise<string> {
        try {
            return await this.minioClient.presignedGetObject(
                this.bucketName,
                filename,
                expirySeconds
            );
        } catch (error) {
            this.logger.error('Error generating presigned URL:', error);
            throw error;
        }
    }

    /**
     * Загрузить файл без привязки к oporaId
     * @param filename имя файла в MinIO
     * @param buffer содержимое файла
     * @param mimetype MIME-тип файла
     */
    async uploadFileDirect(filename: string, buffer: Buffer, mimetype: string): Promise<void> {
        await this.minioClient.putObject(
            this.bucketName,
            filename,
            buffer,
            buffer.length,
            {
                'Content-Type': mimetype,
            },
        );
    }

    /**
     * Проверить существование файла
     * @param filename имя файла
     */
    async fileExists(filename: string): Promise<boolean> {
        try {
            await this.minioClient.statObject(this.bucketName, filename);
            return true;
        } catch (error) {
            if (error.code === 'NotFound') {
                return false;
            }
            throw error;
        }
    }

    /**
     * Получить информацию о файле
     * @param filename имя файла
     */
    async getFileInfo(filename: string): Promise<Minio.BucketItemStat> {
        return await this.minioClient.statObject(this.bucketName, filename);
    }

    /**
     * Получить публичный URL (без подписи)
     * @param filename имя файла
     */
    getPublicUrl(filename: string): string {
        const protocol = this.configService.get<string>('MINIO_USE_SSL') === 'true' ? 'https' : 'http';
        const endpoint = this.configService.get<string>('MINIO_ENDPOINT') || 'localhost';
        const port = this.configService.get<string>('MINIO_PORT') || '9000';

        return `${protocol}://${endpoint}:${port}/${this.bucketName}/${filename}`;
    }

    /**
     * Специальный метод для загрузки файлов проектов
     * @param file загружаемый файл
     * @param projectId ID проекта
     */
    async uploadProjectFile(file: Express.Multer.File, projectId: string | number): Promise<{
        filename: string;
        url: string;
        publicUrl?: string; // Делаем необязательным для обратной совместимости
    }> {
        const filename = `project-${projectId}-${Date.now()}-${file.originalname}`;

        await this.minioClient.putObject(
            this.bucketName,
            filename,
            file.buffer,
            file.size,
            {
                'Content-Type': file.mimetype,
            },
        );

        // Получаем подписанный URL
        const presignedUrl = await this.getFileUrl(filename);
        // Получаем публичный URL
        const publicUrl = this.getPublicUrl(filename);

        return {
            filename,
            url: presignedUrl,
            publicUrl: publicUrl // Добавляем публичный URL
        };
    }
}