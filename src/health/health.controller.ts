import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

/**
 * Health Controller
 * Compatible con Render / Kubernetes / UptimeRobot / cron pings
 */
@Controller('/')
export class HealthController {
  private startupComplete = false;

  constructor(private readonly db: DataSource) {
    // Marcamos startup cuando Nest termina el bootstrap,
    // con un pequeño delay para asegurar conexiones.
    setTimeout(() => {
      this.startupComplete = true;
    }, 1500);
  }

  /**
   * Liveness Probe
   * ¿El proceso está vivo?
   * NO debe hacer llamadas a servicios externos.
   */
  @Get('healthz')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Readiness Probe
   * ¿La app está lista para recibir tráfico?
   * Aquí chequeamos conexión a la DB e inicialización.
   */
  @Get('readyz')
  async getReadiness() {
    if (!this.startupComplete) {
      return { ready: false, reason: 'startup-not-complete' };
    }

    let dbConnected = false;
    try {
      await this.db.query('SELECT 1');
      dbConnected = true;
    } catch {
      dbConnected = false;
    }

    return {
      ready: dbConnected,
      database: dbConnected,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Startup Probe
   * ¿Terminó de inicializar el servicio?
   * Ideal para apps con heavy bootstrap (ORM, Cache, etc.)
   */
  @Get('startupz')
  getStartup() {
    return {
      startupComplete: this.startupComplete,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Métricas simples estilo Prometheus
   * Ideal para monitoreo externo sin dependencias.
   */
  @Get('metrics')
  getMetrics() {
    const uptimeSeconds = Math.floor(process.uptime());
    const memory = process.memoryUsage();

    return `
app_uptime_seconds ${uptimeSeconds}
node_heap_used_bytes ${memory.heapUsed}
node_rss_bytes ${memory.rss}
`.trim();
  }
}
