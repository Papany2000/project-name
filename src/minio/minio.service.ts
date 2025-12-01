import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { Express } from 'express';

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

    async deleteFile(filename: string): Promise<void> {
        await this.minioClient.removeObject(this.bucketName, filename);
    }
}