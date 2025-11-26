import { DataSource, DataSourceOptions } from 'typeorm';
import { envs } from './envs.config';

/**
 * Configuración de TypeORM para PostgreSQL
 */
export const typeormConfig: DataSourceOptions = {
  type: 'postgres',
  host: envs.typeorm.host,
  port: envs.typeorm.port,
  username: envs.typeorm.username,
  password: envs.typeorm.password,
  database: envs.typeorm.database,
  ssl: envs.typeorm.ssl ? { rejectUnauthorized: false } : false,
  entities: [__dirname + '/../../**/*.typeorm-entity{.ts,.js}'],
  migrations: [__dirname + '/../../database/migrations/*{.ts,.js}'],
  synchronize: envs.server.environment === 'development',
  logging: envs.server.environment === 'development',
};

// DataSource para migraciones de TypeORM CLI
export default new DataSource(typeormConfig);
