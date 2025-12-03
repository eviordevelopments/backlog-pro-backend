import { Controller, Get } from "@nestjs/common";
import { DataSource } from "typeorm";

@Controller('health')
export class HealthController {
  constructor(private readonly db: DataSource) {}

  @Get()
  async getHealth() {
    const isDbConnected = this.db.isInitialized;

    return {
      status: isDbConnected ? 'ok' : 'error',
      database: isDbConnected,
      timestamp: new Date().toISOString(),
    };
  }
}
