import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';


@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // Защита JWT и проверка ролей
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get() // ← Добавлен декоратор @Get
  @Roles('admin') // Только админы могут получать список пользователей
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Delete(':id')
  @Roles('admin') // Только админы могут удалять пользователей
  @HttpCode(HttpStatus.OK) // Возвращаем 200 OK вместо 204 No Content
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
