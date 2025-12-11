import type { DataSourceOptions } from 'typeorm';
import { DataSource } from 'typeorm';

import { envs } from './envs.config';

const isProduction = envs.server.environment === 'production' && envs.database.url;
const isCompiled = __filename.endsWith('.js'); // Detecta si estamos usando código compilado

/**
 * Configuración de TypeORM para PostgreSQL
 * Soporta tanto DATABASE_URL (Render) como parámetros individuales (local)
 */
export const databaseConfig: DataSourceOptions = isProduction
  ? {
      // Configuración para Render (usando DATABASE_URL)
      type: 'postgres',
      url: envs.database.url,
      ssl: {
        rejectUnauthorized: false,
      },
      entities: [__dirname + '/../../**/*.typeorm-entity.js'],
      migrations: [__dirname + '/../../database/migrations/*.js'],
      synchronize: false, // NUNCA usar synchronize en producción
      dropSchema: false, // NUNCA usar dropSchema en producción
      logging: false, // SOLO si necesitas ver logs de las queries
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
      // Usa .js si está compilado (Docker), .ts si es desarrollo local
      entities: [__dirname + `/../../**/*.typeorm-entity.${isCompiled ? 'js' : 'ts'}`],
      migrations: [__dirname + `/../../database/migrations/*.${isCompiled ? 'js' : 'ts'}`],
      synchronize: true, // Activalo en desarrollo para sincronizar automaticamente las entidades
      dropSchema: false, // Activalo en desarrollo para limpiar la DB
      logging: false, // Activalo en desarrollo para ver logs de las queries
    };

// DataSource para migraciones de TypeORM CLI
export default new DataSource(databaseConfig);
