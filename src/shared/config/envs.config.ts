import 'dotenv/config';
import { registerAs } from '@nestjs/config';

const server = {
  environment: process.env.NODE_ENV ?? 'development',
  port: parseInt(String(process.env.PORT ?? 3000), 10),
  host: process.env.HOST ?? 'localhost',
};

const typeorm = {
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(String(process.env.DB_PORT ?? 5432), 10),
  database: process.env.DB_DATABASE ?? 'your_app',
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  ssl: process.env.DB_SSL === 'true',
};

const jwt = {
  secret: process.env.JWT_SECRET ?? 'default_jwt_secret',
};

const config = {
  server,
  typeorm,
  jwt,
};

export const envs = config;
export default registerAs('envs', () => envs);
