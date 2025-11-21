// src/users/user.model.ts
import { Table, Column, Model, DataType } from 'sequelize-typescript';


@Table({
  tableName: 'vacancies',
  timestamps: true, // Добавляет createdAt и updatedAt
})
export class Vacancies extends Model {
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare speciality: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare description: string;

  @Column({
      type: DataType.STRING,
      allowNull: false,
  })
  declare salary: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare requirements: string;
  
} 