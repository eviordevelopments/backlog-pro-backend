import { Injectable, Logger } from '@nestjs/common';

import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { EmailService } from '../../../shared/services/email.service';
import { UserRepository } from '../../repository/user.repository';
import { JwtService } from '../services/jwt.service';
import { RequestPasswordResetCommand } from './request-password-reset.command';

export interface PasswordResetResult {
  resetToken: string;
  expiresIn: string;
}

@Injectable()
export class RequestPasswordResetCommandHandler {
  private readonly logger = new Logger(RequestPasswordResetCommandHandler.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async handle(command: RequestPasswordResetCommand): Promise<PasswordResetResult> {
    this.logger.log(`Solicitando reset de contraseña para: ${command.email}`);

    // Obtener usuario por email
    const user = await this.userRepository.getByEmail(command.email);
    if (!user) {
      throw new UserNotFoundException(command.email);
    }

    // Generar token de reset
    const resetToken = this.jwtService.generateResetToken(user.id, user.email);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Guardar token en la base de datos
    await this.userRepository.update(user.id, {
      passwordResetToken: resetToken,
      passwordResetExpiresAt: expiresAt,
    });

    this.logger.log(`Token de reset generado para usuario: ${user.id}`);

    // Enviar email con el token de reset
    try {
      await this.sendPasswordResetEmail(user.email, user.name, resetToken);
      this.logger.log(`Email de reset de contraseña enviado a: ${user.email}`);
    } catch (error) {
      this.logger.error(`Error enviando email de reset: ${(error as Error).message}`);
      // No lanzar error, el token se generó correctamente
    }

    return {
      resetToken,
      expiresIn: '1h',
    };
  }

  private async sendPasswordResetEmail(
    email: string,
    name: string,
    resetToken: string,
  ): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Restablecer Contraseña - Backlog Pro</h2>
        <p>Hola ${name},</p>
        <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Backlog Pro.</p>
        <p>Para crear una nueva contraseña, haz clic en el siguiente enlace:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Restablecer Contraseña
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:<br>
          <a href="${resetUrl}">${resetUrl}</a>
        </p>
        <p style="color: #666; font-size: 14px;">
          <strong>Este enlace expirará en 1 hora por seguridad.</strong>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">
          Si no solicitaste restablecer tu contraseña, puedes ignorar este email. Tu contraseña no será cambiada.
        </p>
      </div>
    `;

    const text = `
      Restablecer Contraseña - Backlog Pro
      
      Hola ${name},
      
      Para restablecer tu contraseña, visita: ${resetUrl}
      
      Este enlace expirará en 1 hora.
      
      Si no solicitaste este cambio, ignora este email.
    `;

    await this.emailService.sendEmail({
      to: email,
      subject: 'Restablecer contraseña - Backlog Pro',
      html,
      text,
    });
  }
}
