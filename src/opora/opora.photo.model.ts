import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Opora } from './opora.model';


@Table({
    tableName: 'photos',
    timestamps: true,
})
export class Photo extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    filename: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    originalName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    url: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    size: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    mimetype: string;

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    })
    uploadedAt: Date;

    @ForeignKey(() => Opora)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    oporaId: number;

    @BelongsTo(() => Opora)
    opora: Opora;
}