import 'dotenv/config';
import { registerAs } from '@nestjs/config';

const server = {
  environment: process.env.NODE_ENV,
  port: parseInt(String(process.env.PORT), 10),
};

const database = {
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST,
  port: parseInt(String(process.env.DB_PORT), 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

const jwt = {
  secret: process.env.JWT_SECRET,
  expiresIn: parseInt(String(process.env.JWT_EXPIRES_IN)) * 60 * 60 * 24, // Conversión a horas
};

const config = {
  server,
  database,
  jwt,
};

export const envs = config;
export default registerAs('envs', () => envs);
