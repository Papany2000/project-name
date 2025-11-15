// src/users/user.model.ts
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { RefreshToken } from 'src/auth/models/refresh-token.model';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

@Table({
  tableName: 'users',
  timestamps: true, // Добавляет createdAt и updatedAt
})
export class User extends Model {
  // Используем declare чтобы избежать конфликта с Sequelize
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.USER,
  })
  declare role: UserRole;

  @HasMany(() => RefreshToken)
  refreshTokens: RefreshToken[];
}
