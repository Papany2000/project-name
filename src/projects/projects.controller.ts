// src/projects/projects.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';


@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Post()
    @ApiOperation({ summary: 'Создать новый проект' })
    create(@Body() createProjectDto: CreateProjectDto) {
        return this.projectsService.create(createProjectDto);
    }

    @Get()
    @ApiOperation({ summary: 'Получить все проекты с URL файлов' })
    async findAll() {
        return this.projectsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить проект по ID' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.projectsService.findOne(id);
    }

    @Get(':id/file-url')
    @ApiOperation({ summary: 'Получить URL файла проекта' })
    async getFileUrl(@Param('id', ParseIntPipe) id: number) {
        const url = await this.projectsService.getFileUrl(id);
        return { url };
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Обновить проект' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProjectDto: UpdateProjectDto,
    ) {
        return this.projectsService.update(id, updateProjectDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Удалить проект' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.projectsService.remove(id);
    }

    @Post(':id/upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Загрузить фото для проекта' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    uploadFile(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new Error('Файл не был загружен');
        }
        return this.projectsService.uploadFile(id, file);
    }

    @Delete(':id/file')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Удалить фото проекта' })
    deleteFile(@Param('id', ParseIntPipe) id: number) {
        return this.projectsService.deleteFile(id);
    }
}
