import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

// Cargar variables de entorno
dotenvConfig({ path: '.env' });

const server = {
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(String(process.env.PORT || '3000'), 10),
};

const database = {
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(String(process.env.DB_PORT || '5432'), 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'backlog_pro',
};

const adminer = {
  port: process.env.ADMINER_PORT || 8080,
};

const jwt = {
  secret: process.env.JWT_SECRET || 'default_jwt_secret_change_in_production',
  expiresIn: parseInt(String(process.env.JWT_EXPIRES_IN || '1d'), 10) * 60 * 60 * 24, // Conversión a días
};

const frontend = {
  url: process.env.FRONTEND_URL || 'http://localhost:4200',
};

const cronitor = {
  apiKey: process.env.CRONITOR_API_KEY,
};

const config = {
  server,
  database,
  adminer,
  jwt,
  frontend,
  cronitor,
};

export const envs = config;
export default registerAs('envs', () => envs);
