import { PartialType } from '@nestjs/mapped-types';
import { CreateOporaDto } from './create-opora.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOporaDto extends PartialType(CreateOporaDto) {
    @ApiPropertyOptional({ description: 'Уникальный идентификатор опоры' })
    oporaId?: string;

    @ApiPropertyOptional({ description: 'Координаты опоры [широта, долгота]', type: [Number] })
    coordinates?: number[];

    @ApiPropertyOptional({ description: 'Комментарии к опоре' })
    comments?: string;

    @ApiPropertyOptional({
        description: 'Статус опоры',
        enum: ['соответствует', 'не соответствует', 'в работе']
    })
    status?: string;
}