// src/projects/project.model.ts
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: 'projects',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})
export class Project extends Model {

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    })
    obj_name: string;

    @Column({
        type: DataType.STRING(500),
        allowNull: true,
    })
    foto: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    comments: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
        field: 'original_filename',
    })
    originalFilename: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: true,
    })
    mimetype: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    size: number;
}