import { IsArray, IsString, IsOptional, IsEnum, IsNumber, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOporaDto {
    @ApiProperty({
        description: 'Уникальный идентификатор опоры',
        example: 'OPORA-001',
    })
    @IsString()
    oporaId: string;

    @ApiProperty({
        description: 'Координаты опоры [широта, долгота]',
        example: [55.7558, 37.6176],
        type: [Number],
    })
    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    @IsNumber({}, { each: true })
    coordinates: number[];

    @ApiPropertyOptional({
        description: 'Комментарии к опоре',
        example: 'Тестовая опора в центре города',
    })
    @IsString()
    @IsOptional()
    comments?: string;

    @ApiPropertyOptional({
        description: 'Статус опоры',
        enum: ['соответствует', 'не соответствует', 'в работе'],
        example: 'в работе',
    })
    @IsEnum(['соответствует', 'не соответствует', 'в работе'])
    @IsOptional()
    status?: string;
}