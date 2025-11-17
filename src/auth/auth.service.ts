import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'; // Импортируйте ConfigService
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import * as crypto from 'crypto'; // Для генерации случайных токенов

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository, // Внедряем репозиторий RefreshToken
    private readonly configService: ConfigService, // Инжектируйте ConfigService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByLoginWithPassword(email);
    if (!user) {
      return null;
    }

    // Добавляем проверки перед сравнением паролей
    if (!pass || !user.password) {
      return null;
    }

    const match = await this.comparePassword(pass, user.password);
    if (!match) {
      return null;
    }
    // Возвращаем полную информацию о пользователе
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async login(
    user: CreateUserDTO,
  ): Promise<{ accessToken: any; refreshToken: any; newUser: any }> {
    const newUser = await this.validateUser(user.email, user.password);
    if (!newUser) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = await this.generateAccessToken(newUser);
    const refreshToken = await this.generateRefreshToken(newUser);
    return { accessToken, refreshToken, newUser };
  }

  async logout(refreshToken) {
    // Удаляем запись из БД
    await this.refreshTokenRepository.delete(refreshToken);
  }

  public async create(
    user: CreateUserDTO,
  ): Promise<{ newUser: any; accessToken: string; refreshToken: string }> {
    const pass = await this.hashPassword(user.password);

    const newUser = await this.usersService.CreateUser({
      ...user,
      password: pass,
    });

    const accessToken = await this.generateAccessToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });
    const refreshToken = await this.generateRefreshToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });
    return { newUser, accessToken, refreshToken };
  }
  //======================================================
  /**
   * Регистрация пользователя без автоматического входа
   * Возвращает данные пользователя без токенов
   */
  public async registration(
    user: CreateUserDTO,
  ): Promise<{
    id: number;
    email: string;
    name: string;
    role: string;
    createdAt: Date;
    message: string;
  }> {
    // Проверяем, существует ли пользователь с таким email
    const existingUser = await this.usersService.findOneByLogin(user.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Хешируем пароль
    const hashedPassword = await this.hashPassword(user.password);

    // Создаем пользователя
    const newUser = await this.usersService.CreateUser({
      ...user,
      password: hashedPassword,
    });

    // Возвращаем данные пользователя без токенов
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      createdAt: newUser.createdAt,
      message: 'User registered successfully. Please login to continue.'
    };
  }


//======================================================
  public async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken?: string }> {
    const refreshTokenEntity =
      await this.refreshTokenRepository.findOne(refreshToken);
    // Если токен не найден в базе - он невалидный
    if (!refreshTokenEntity) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    // Если рефреш токен истек - удаляем его из базы (очистка если не посещали сайт 7 дней)
    if (refreshTokenEntity.expiresAt < new Date()) {
      await this.refreshTokenRepository.delete(refreshToken);
      throw new UnauthorizedException('Срок действия токена обновления истек');
    }

    // 4. Получаем пользователя, связанного с этим refresh token
    const user = await this.usersService.findOneById(refreshTokenEntity.userId); 
    if (!user) {
      // Если пользователь не найден - возможно он был удален
      throw new UnauthorizedException('Пользователь не найден');
    }

    //  УДАЛЯЕМ использованный refresh token (ротация токенов)
    // Это важно для безопасности - каждый refresh token можно использовать только один раз
    await this.refreshTokenRepository.delete(refreshToken);

    // 7. Генерируем НОВЫЙ acces token 
    const accessToken = await this.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // сгенерируйте новый refreshToken обновления.
    const newRefreshToken = await this.generateRefreshToken(user);
    return { accessToken, refreshToken: newRefreshToken };
  }
//======================================================
  private async generateAccessToken(user: any): Promise<string> {
    const payload = {
      sub: user.id, email: user.email, role: user.role  };
    const secret = this.configService.get<string>('JWT_SECRET'); // secret получаем из конфига
    if (!secret) {
      console.error('JWT_SECRET is not defined!');
    }
    return this.jwtService.sign(payload, { secret }); //токен создаётся методом sign
  }

  private async generateRefreshToken(user: any): Promise<string> {
    const token = crypto.randomBytes(64).toString('hex'); // Генерация случайного токена
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Срок действия 7 дней

    const refreshTokenEntity = {
      token: token,
      expiresAt: expiresAt,
      userId: user.id,
      role: user.role // Добавляем роль пользователя
    };
    await this.refreshTokenRepository.create(refreshTokenEntity); //токен создаётся методом create и сохраняется в бд
    return token;
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  private async comparePassword(enteredPassword: string, dbPassword: string): Promise<boolean> {
    // Добавляем проверки перед сравнением
    if (!enteredPassword || !dbPassword) {
      return false;
    }
    try {
      return await bcrypt.compare(enteredPassword, dbPassword);
    } catch (error) {
      console.error('Password comparison error:', error);
      return false;
    }
  }
}
