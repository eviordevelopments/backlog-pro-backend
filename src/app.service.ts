import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  getHello(): string {
    return 'Backlog Pro API - GraphQL Backend';
  }

  async getHealth(): Promise<{
    status: string;
    timestamp: string;
    service: string;
    database: {
      connected: boolean;
      type?: string;
      database?: string;
    };
  }> {
    let dbConnected = false;
    let dbType: string | undefined;
    let dbName: string | undefined;

    try {
      // Verificar conexión a la base de datos
      if (this.dataSource.isInitialized) {
        await this.dataSource.query('SELECT 1');
        dbConnected = true;
        dbType = this.dataSource.options.type;
        
        // Extraer nombre de la base de datos
        const options = this.dataSource.options as any;
        if (options.database) {
          dbName = options.database;
        } else if (options.url) {
          // Extraer de DATABASE_URL: postgresql://user:pass@host:5432/dbname
          const match = options.url.match(/\/([^/?]+)(\?|$)/);
          dbName = match ? match[1] : undefined;
        }
      }
    } catch (error) {
      dbConnected = false;
    }

    return {
      status: dbConnected ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      service: 'Backlog Pro API',
      database: {
        connected: dbConnected,
        ...(dbConnected && { type: dbType, database: dbName }),
      },
    };
  }
}
