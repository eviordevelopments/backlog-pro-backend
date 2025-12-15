import { cronitorService } from '../services/cronitor.service';

/**
 * Tarea que envía heartbeats periódicos a Cronitor
 * para verificar que la aplicación sigue funcionando
 */
export class HeartbeatTask {
  private intervalId?: NodeJS.Timeout;

  /**
   * Inicia el envío de heartbeats cada 5 minutos
   */
  start(): void {
    // Enviar heartbeat inmediatamente
    void this.sendHeartbeat();

    // Luego cada 5 minutos
    this.intervalId = setInterval(
      () => {
        void this.sendHeartbeat();
      },
      5 * 60 * 1000,
    ); // 5 minutos

    console.log('📡 Heartbeat task started (every 5 minutes)');
  }

  /**
   * Detiene el envío de heartbeats
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      console.log('📡 Heartbeat task stopped');
    }
  }

  /**
   * Envía un heartbeat con métricas del sistema
   */
  private async sendHeartbeat(): Promise<void> {
    const uptime = Math.floor(process.uptime());
    const memory = process.memoryUsage();

    await cronitorService.heartbeat('backlog-pro-heartbeat', {
      message: 'System alive',
      metadata: {
        uptime: `${uptime}s`,
        memoryUsed: `${Math.round(memory.heapUsed / 1024 / 1024)}MB`,
        memoryTotal: `${Math.round(memory.heapTotal / 1024 / 1024)}MB`,
      },
    });
  }
}

export const heartbeatTask = new HeartbeatTask();
