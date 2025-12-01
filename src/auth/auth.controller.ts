import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация и аутотентификация пользователя' })
  @ApiBody({ type: CreateUserDTO })
  @ApiResponse({ status: 201, description: 'User успешно создан' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('signin')
  async signin(@Body() user: CreateUserDTO) {
    return this.authService.create(user);
  }

  @ApiOperation({
    summary: 'Обновление токена доступа',
    description: 'Обновляет access token с помощью валидного refresh token. Используется когда access token истек.'
  })
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Refresh token для получения новой пары токенов',
    examples: {
      example: {
        summary: 'Пример запроса',
        value: {
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    }
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Токены успешно обновлены',
    examples: {
      example: {
        summary: 'Успешный ответ',
        value: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Некорректный запрос - отсутствует refresh token',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'Refresh token is required',
          error: 'Bad Request'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token невалиден, истек или отозван',
    content: {
      'application/json': {
        example: {
          statusCode: 401,
          message: 'Invalid refresh token',
          error: 'Unauthorized'
        }
      }
    }
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('registration')
  async registration(@Body() user: CreateUserDTO) {
    return this.authService.registration(user);
  }

  @ApiOperation({
    summary: 'Обновление токена доступа',
    description: 'Обновляет access token с помощью валидного refresh token. Используется когда access token истек.'
  })
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Refresh token для получения новой пары токенов',
    examples: {
      example: {
        summary: 'Пример запроса',
        value: {
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    }
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Токены успешно обновлены',
    examples: {
      example: {
        summary: 'Успешный ответ',
        value: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Некорректный запрос - отсутствует refresh token',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'Refresh token is required',
          error: 'Bad Request'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token невалиден, истек или отозван',
    content: {
      'application/json': {
        example: {
          statusCode: 401,
          message: 'Invalid refresh token',
          error: 'Unauthorized'
        }
      }
    }
  })
  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
  }

  @ApiOperation({ summary: 'Аутотентификация пользователя' })
  @ApiBody({ type: CreateUserDTO })
  @ApiResponse({ status: 200, description: 'Успешо' })
  @ApiResponse({ status: 401, description: 'Описание ошибки' })
  @Post('login')
  async login(@Body() user) {
    return this.authService.login(user); // Вернет { accessToken, refreshToken }
  }

  @ApiOperation({
    summary: 'Выход из системы',
    description: 'Удаляет refresh token пользователя',
  })
  @ApiNoContentResponse({ description: 'Токен успешно удален (204)' })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @ApiUnauthorizedResponse({ description: 'Недействительный токен' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(@Body() logoutDto: RefreshTokenDto): Promise<void> {
    try {
      await this.authService.logout(logoutDto.refreshToken);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
