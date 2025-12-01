import { DataSource, DataSourceOptions } from 'typeorm';
import { envs } from '@shared/config';

/**
 * Configuración de TypeORM para PostgreSQL
 * Soporta tanto DATABASE_URL (Render) como parámetros individuales (local)
 */
export const databaseConfig: DataSourceOptions = envs.database.url
  ? {
      // Configuración para Render (usando DATABASE_URL)
      type: 'postgres',
      url: envs.database.url,
      ssl: {
        rejectUnauthorized: false,
      },
      entities: [__dirname + '/../../**/*.typeorm-entity{.ts,.js}'],
      migrations: [__dirname + '/../../database/migrations/*{.ts,.js}'],
      synchronize: false, // NUNCA usar synchronize en producción
      logging: false,
    }
  : {
      // Configuración local (usando parámetros individuales)
      type: 'postgres',
      host: envs.database.host,
      port: envs.database.port,
      username: envs.database.username,
      password: envs.database.password,
      database: envs.database.database,
      ssl: false,
      entities: [__dirname + '/../../**/*.typeorm-entity{.ts,.js}'],
      migrations: [__dirname + '/../../database/migrations/*{.ts,.js}'],
      synchronize: envs.server.environment === 'development',
      // logging: envs.server.environment === 'development',
      dropSchema: true,
    };

// DataSource para migraciones de TypeORM CLI
export default new DataSource(databaseConfig);
