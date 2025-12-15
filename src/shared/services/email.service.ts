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
    // Configuración por defecto: Mailtrap (recomendado para desarrollo)
    // Alternativas: Gmail (emails reales)
    // En producción: SendGrid, AWS SES, etc.
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
      port: parseInt(process.env.SMTP_PORT || '2525'),
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER || 'NO_CONFIGURADO',
        pass: process.env.SMTP_PASS || 'NO_CONFIGURADO',
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"Backlog Pro" <noreply@backlogpro.com>',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.log(`Email enviado: ${String(info.messageId)}`);

      // Para desarrollo, mostrar información útil
      if (process.env.NODE_ENV === 'development') {
        // Para servicios de testing, mostrar URL de preview si está disponible
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          this.logger.log(`Preview URL: ${previewUrl}`);
        }
        // Para Mailtrap, recordar dónde ver los emails
        if (process.env.SMTP_HOST?.includes('mailtrap')) {
          this.logger.log('📧 Revisa tu inbox en https://mailtrap.io/inboxes');
        }
      }
    } catch (error) {
      this.logger.error('Error enviando email:', error);
      throw new Error(
        `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
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
