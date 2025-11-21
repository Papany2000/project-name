// src/users/dto/create-user.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVacaciesDTO {

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Специальность не может быть пустой' })
    readonly speciality: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Описание не может быть пустым' })
    readonly description: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Зарплата не может быть пустой' })
    readonly salary: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Требования не могут быть пустыми' })
    readonly requirements: string;
}