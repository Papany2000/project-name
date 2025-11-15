import { registerAs } from '@nestjs/config';
import { AppConfig } from './config.interface';

const appConfig = registerAs<AppConfig>('app', (): AppConfig => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  

  // Получаем значения с fallback значениями
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables. Please check your .env file');
  }

  const postgresHost = process.env.POSTGRES_HOST || 'localhost';
  const postgresUser = process.env.POSTGRES_USER || 'postgres';
  const postgresPort = parseInt(process.env.POSTGRES_PORT || '5432', 10);
  const postgresPassword = process.env.POSTGRES_PASSWORD || '1961qwer';
  const postgresDatabase = process.env.POSTGRES_DB || 'parent';
  const apiPort = parseInt(process.env.PORT || '5000', 10);
  const tokenExpiration = process.env.JWT_EXPIRATION || '15m';

  

  return {
    database: {
      host: postgresHost,
      user: postgresUser,
      port: postgresPort,
      password: postgresPassword,
      database: postgresDatabase,
    },
    api: {
      port: apiPort,
    },
    jwt: {
      secret: jwtSecret,
      expiration: tokenExpiration,
    },
  };
});

export default appConfig;
