import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter!: nodemailer.Transporter;

  constructor() {
    this.createTransporter();
  }

  private createTransporter() {
    const smtpHost = process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io';
    const smtpPort = parseInt(process.env.SMTP_PORT || '2525');
    const smtpUser = process.env.SMTP_USER || 'NO_CONFIGURADO';
    const smtpPass = process.env.SMTP_PASS || 'NO_CONFIGURADO';

    this.logger.log(`Configurando SMTP: ${smtpHost}:${smtpPort} (user: ${smtpUser})`);

    // Configuración por defecto: Mailtrap (recomendado para desarrollo)
    // Alternativas: Gmail (emails reales)
    // En producción: SendGrid, AWS SES, etc.
    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true para 465, false para otros puertos
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      // Configuraciones adicionales para robustez
      connectionTimeout: process.env.NODE_ENV === 'production' ? 30000 : 10000, // 30s en prod, 10s en dev
      greetingTimeout: process.env.NODE_ENV === 'production' ? 15000 : 5000, // 15s en prod, 5s en dev
      socketTimeout: process.env.NODE_ENV === 'production' ? 30000 : 10000, // 30s en prod, 10s en dev
      // Para Gmail específicamente (configuración optimizada para cloud)
      ...(smtpHost.includes('gmail') && {
        service: 'gmail',
        tls: {
          rejectUnauthorized: false,
          ciphers: 'SSLv3'
        },
        requireTLS: true,
        logger: false, // Deshabilitar logs SMTP detallados
        debug: false   // Deshabilitar debug SMTP
      })
    });

    // Verificar la conexión al inicializar
    this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    // En producción, saltamos la verificación para evitar timeouts
    if (process.env.NODE_ENV === 'production') {
      this.logger.log('🚀 Producción: Saltando verificación SMTP (se verificará al enviar)');
      return;
    }

    try {
      await this.transporter.verify();
      this.logger.log('✅ Conexión SMTP verificada exitosamente');
    } catch (error) {
      this.logger.error('❌ Error verificando conexión SMTP:', error);
      this.logger.warn('⚠️ Los emails pueden fallar. Verifica la configuración SMTP.');
    }
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    // Opción para deshabilitar emails completamente
    if (process.env.DISABLE_EMAILS === 'true') {
      this.logger.log(`📧 [DISABLED] Email simulado a: ${options.to} - ${options.subject}`);
      return;
    }

    const startTime = Date.now();
    this.logger.log(`📧 Enviando email a: ${options.to}`);

    try {
      // Crear una promesa con timeout
      const sendPromise = this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"Backlog Pro" <noreply@backlogpro.com>',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      // Timeout más largo en producción
      const timeoutMs = process.env.NODE_ENV === 'production' ? 60000 : 30000; // 60s en prod, 30s en dev
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Email timeout after ${timeoutMs/1000} seconds`)), timeoutMs);
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const info = await Promise.race([sendPromise, timeoutPromise]);
      const duration = Date.now() - startTime;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.log(`✅ Email enviado exitosamente en ${duration}ms: ${String(info.messageId)}`);

      // Para desarrollo, mostrar información útil
      if (process.env.NODE_ENV === 'development') {
        // Para servicios de testing, mostrar URL de preview si está disponible
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          this.logger.log(`🔗 Preview URL: ${previewUrl}`);
        }
        // Para Mailtrap, recordar dónde ver los emails
        if (process.env.SMTP_HOST?.includes('mailtrap')) {
          this.logger.log('📧 Revisa tu inbox en https://mailtrap.io/inboxes');
        }
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`❌ Error enviando email después de ${duration}ms:`, error);
      
      // No lanzar error para evitar que bloquee el registro
      // En su lugar, solo loggear el error
      this.logger.warn('⚠️ El registro continuará sin envío de email');
    }
  }

  async sendConfirmationEmail(email: string, confirmationToken: string): Promise<void> {
    const confirmationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/confirm-email?token=${confirmationToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">¡Bienvenido a Backlog Pro!</h2>
        <p>Gracias por registrarte en nuestra plataforma de gestión de proyectos.</p>
        <p>Para completar tu registro y activar tu cuenta, por favor haz clic en el siguiente enlace:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Confirmar Email
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:<br>
          <a href="${confirmationUrl}">${confirmationUrl}</a>
        </p>
        <p style="color: #666; font-size: 14px;">
          Este enlace expirará en 24 horas por seguridad.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">
          Si no te registraste en Backlog Pro, puedes ignorar este email.
        </p>
      </div>
    `;

    const text = `
      ¡Bienvenido a Backlog Pro!
      
      Para confirmar tu email y activar tu cuenta, visita: ${confirmationUrl}
      
      Este enlace expirará en 24 horas.
    `;

    await this.sendEmail({
      to: email,
      subject: 'Confirma tu email - Backlog Pro',
      html,
      text,
    });
  }
}
