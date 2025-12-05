import cronitor from 'cronitor';

import { envs } from '../config';

/**
 * Servicio de monitoreo con Cronitor
 * Permite trackear eventos, errores y métricas del backend
 */
export class CronitorService {
  private static instance: CronitorService;
  private cronitor: ReturnType<typeof cronitor>;
  private isEnabled: boolean;

  private constructor() {
    this.isEnabled = !!envs.cronitor?.apiKey;

    if (this.isEnabled && envs.cronitor?.apiKey) {
      this.cronitor = cronitor(envs.cronitor.apiKey, {
        environment: envs.server.environment,
      });
    } else {
      // Inicializar con una instancia dummy para evitar errores
      this.cronitor = cronitor('dummy-key');
    }
  }

  static getInstance(): CronitorService {
    if (!CronitorService.instance) {
      CronitorService.instance = new CronitorService();
    }
    return CronitorService.instance;
  }

  /**
   * Trackea un evento personalizado
   */
  async trackEvent(eventName: string, metadata?: Record<string, unknown>): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const monitor = new this.cronitor.Monitor(eventName);
      await monitor.ping({
        state: 'complete',
        message: metadata ? JSON.stringify(metadata) : undefined,
      });
      // Solo mostrar log en desarrollo
      if (envs.server.environment !== 'production') {
        console.log(`   ↳ Cronitor event tracked: ${eventName}`);
      }
    } catch (error) {
      console.error('❌ Error tracking Cronitor event:', error);
    }
  }

  /**
   * Reporta un error
   */
  trackError(errorName: string, error: Error, metadata?: Record<string, unknown>): void {
    if (!this.isEnabled) return;

    try {
      const monitor = new this.cronitor.Monitor(errorName);
      void monitor.ping({
        state: 'fail',
        message: error.message,
        env: JSON.stringify({
          ...metadata,
          stack: error.stack,
        }),
      });
    } catch (err) {
      console.error('Error tracking Cronitor error:', err);
    }
  }

  /**
   * Trackea el inicio de un job/tarea
   */
  startJob(jobName: string): void {
    if (!this.isEnabled) return;

    try {
      const monitor = new this.cronitor.Monitor(jobName);
      void monitor.ping({ state: 'run' });
    } catch (error) {
      console.error('Error starting Cronitor job:', error);
    }
  }

  /**
   * Trackea la finalización exitosa de un job/tarea
   */
  completeJob(jobName: string, metadata?: Record<string, unknown>): void {
    if (!this.isEnabled) return;

    try {
      const monitor = new this.cronitor.Monitor(jobName);
      void monitor.ping({
        state: 'complete',
        message: metadata ? JSON.stringify(metadata) : undefined,
      });
    } catch (error) {
      console.error('Error completing Cronitor job:', error);
    }
  }

  /**
   * Trackea el fallo de un job/tarea
   */
  failJob(jobName: string, error: Error): void {
    if (!this.isEnabled) return;

    try {
      const monitor = new this.cronitor.Monitor(jobName);
      void monitor.ping({
        state: 'fail',
        message: error.message,
      });
    } catch (err) {
      console.error('Error failing Cronitor job:', err);
    }
  }

  /**
   * Envía un heartbeat (señal de vida) al monitor
   * Útil para verificar que la aplicación sigue funcionando
   */
  async heartbeat(
    monitorName: string,
    options?: {
      message?: string;
      count?: number;
      errorCount?: number;
      metadata?: Record<string, unknown>;
    },
  ): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const monitor = new this.cronitor.Monitor(monitorName);
      
      // Construir el mensaje con metadata si existe
      let message = options?.message || 'Alive';
      if (options?.metadata) {
        const metadataStr = Object.entries(options.metadata)
          .map(([key, value]) => `${key}=${value}`)
          .join(', ');
        message = `${message} | ${metadataStr}`;
      }

      await monitor.ping({
        message,
        ...(options?.count !== undefined && { count: options.count }),
        ...(options?.errorCount !== undefined && { error_count: options.errorCount }),
      });

      if (envs.server.environment !== 'production') {
        console.log(`   ↳ Cronitor heartbeat sent: ${monitorName}`);
      }
    } catch (error) {
      console.error('❌ Error sending Cronitor heartbeat:', error);
    }
  }
}

export const cronitorService = CronitorService.getInstance();
