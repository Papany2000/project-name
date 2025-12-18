// src/projects/dto/create-project.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
    @ApiProperty({ description: 'Название объекта', example: 'ПСС 110 КВт' })
    @IsString()
    @IsNotEmpty()
    obj_name: string;

    @ApiProperty({
        description: 'Комментарии к проекту',
        example: 'Строительство подстанции',
        required: false
    })
    @IsString()
    @IsOptional()
    comments?: string;
}