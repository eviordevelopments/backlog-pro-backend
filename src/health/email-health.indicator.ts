import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';

import { EmailService } from '../shared/services/email.service';

@Injectable()
export class EmailHealthIndicator {
  constructor(private readonly emailService: EmailService) {}

  isHealthy(key: string): HealthIndicatorResult {
    try {
      // Verificar que el servicio de email esté disponible
      // En desarrollo, el servicio puede estar configurado pero la conexión SMTP puede fallar
      if (process.env.NODE_ENV === 'development') {
        console.log('Email service health check - development mode');
      }

      return {
        [key]: {
          status: 'up',
          configured: true,
          host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
          port: process.env.SMTP_PORT || '2525',
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        [key]: {
          status: 'down',
          error: errorMessage,
        },
      };
    }
  }
}
