import { Table, Column, Model, DataType, HasMany, Unique, Index } from 'sequelize-typescript';

import { ApiProperty } from '@nestjs/swagger';
import { Photo } from './opora.photo.model';

@Table({
    tableName: 'opora',
    timestamps: true,
})
export class Opora extends Model {
    @Unique
    @ApiProperty({ description: 'Внешний ID опоры', example: 'OPORA-001' })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    oporaId: string;

    @Index('coordinates_idx')
    @ApiProperty({ description: 'Координаты [широта, долгота]', example: [55.7558, 37.6176] })
    @Column({
        type: DataType.ARRAY(DataType.DECIMAL(10, 6)),
        allowNull: false,
    })
    coordinates: number[];

    @ApiProperty({ description: 'Комментарии', example: 'Тестовая опора' })
    @Column({
        type: DataType.TEXT,
        defaultValue: '',
    })
    comments: string;

    @ApiProperty({
        description: 'Статус опоры',
        enum: ['соответствует', 'не соответствует', 'в работе'],
        example: 'в работе'
    })
    @Column({
        type: DataType.ENUM('соответствует', 'не соответствует', 'в работе'),
        defaultValue: 'в работе',
    })
    status: string;

    @ApiProperty({ description: 'Фотографии опоры', type: [Photo] })
    @HasMany(() => Photo)
    photos: Photo[];

}