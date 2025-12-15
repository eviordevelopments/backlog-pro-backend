import { Body, Controller, Get, Post } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { EmailService } from '../shared/services/email.service';
import { EmailHealthIndicator } from './email-health.indicator';

/**
 * Health Controller
 * Compatible con Render / Kubernetes / UptimeRobot / cron pings
 */
@Controller('/')
export class HealthController {
  private startupComplete = false;

  constructor(
    private readonly db: DataSource,
    private readonly emailHealthIndicator: EmailHealthIndicator,
    private readonly emailService: EmailService,
  ) {
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
   * Aquí chequeamos conexión a la DB, email service e inicialización.
   */
  @Get('readyz')
  async getReadiness() {
    if (!this.startupComplete) {
      return { ready: false, reason: 'startup-not-complete' };
    }

    let dbConnected = false;
    let emailHealthy = false;

    try {
      await this.db.query('SELECT 1');
      dbConnected = true;
    } catch {
      dbConnected = false;
    }

    try {
      this.emailHealthIndicator.isHealthy('email');
      emailHealthy = true;
    } catch {
      emailHealthy = false;
    }

    const ready = dbConnected && emailHealthy;

    return {
      ready,
      database: dbConnected,
      email: emailHealthy,
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
   * Test Email Endpoint (solo en desarrollo)
   * Permite probar el envío de emails
   */
  @Get('test-email')
  testEmailStatus() {
    if (process.env.NODE_ENV === 'production') {
      return { error: 'Test email endpoint disabled in production' };
    }

    try {
      const emailHealth = this.emailHealthIndicator.isHealthy('email');

      return {
        status: 'Email service is healthy',
        details: emailHealth,
        note: 'Use POST /test-email with { "to": "email@example.com" } to send a test email',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        status: 'Email service is unhealthy',
        error: errorMessage,
      };
    }
  }

  /**
   * Send Test Email (solo en desarrollo)
   * Envía un email de prueba
   */
  @Post('test-email')
  async sendTestEmail(@Body() body: { to: string }) {
    if (process.env.NODE_ENV === 'production') {
      return { error: 'Test email endpoint disabled in production' };
    }

    if (!body.to) {
      return { error: 'Email "to" is required' };
    }

    try {
      await this.emailService.sendEmail({
        to: body.to,
        subject: '🧪 Test Email - Backlog Pro',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #007bff;">🧪 Email de Prueba</h2>
            <p>Este es un email de prueba desde <strong>Backlog Pro</strong>.</p>
            <p>Si recibes este mensaje, la configuración de email está funcionando correctamente.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              Enviado el: ${new Date().toLocaleString()}<br>
              Configuración: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}
            </p>
          </div>
        `,
        text: 'Este es un email de prueba desde Backlog Pro. Si recibes este mensaje, la configuración está funcionando correctamente.',
      });

      return {
        success: true,
        message: `Test email sent successfully to ${body.to}`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to send test email: ${errorMessage}`,
      };
    }
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
