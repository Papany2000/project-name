// src/projects/projects.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './projects.model';

@Injectable()
export class ProjectsRepository {
    constructor(
        @InjectModel(Project)
        private projectModel: typeof Project,
    ) { }

    async create(createProjectDto: CreateProjectDto): Promise<Project> {
        return this.projectModel.create({
            obj_name: createProjectDto.obj_name,
            comments: createProjectDto.comments,
        });
    }

    async findAll(): Promise<Project[]> {
        return this.projectModel.findAll({
            order: [['created_at', 'DESC']],
        });
    }

    async findOne(id: number): Promise<Project | null> {
        return this.projectModel.findByPk(id);
    }

    async update(id: number, updateProjectDto: UpdateProjectDto): Promise<[number, Project[]]> {
        return this.projectModel.update(updateProjectDto, {
            where: { id },
            returning: true,
        });
    }

    async remove(id: number): Promise<number> {
        return this.projectModel.destroy({
            where: { id },
        });
    }

    async updateWithFile(
        id: number,
        fileData: {
            foto: string;
            originalFilename: string;
            mimetype: string;
            size: number;
        },
    ): Promise<[number, Project[]]> {
        return this.projectModel.update(
            {
                foto: fileData.foto,
                original_filename: fileData.originalFilename,
                mimetype: fileData.mimetype,
                size: fileData.size,
            },
            {
                where: { id },
                returning: true,
            },
        );
    }

    async deleteFile(id: number): Promise<[number, Project[]]> {
        return this.projectModel.update(
            {
                foto: null,
                original_filename: null,
                mimetype: null,
                size: null,
            },
            {
                where: { id },
                returning: true,
            },
        );
    }
}