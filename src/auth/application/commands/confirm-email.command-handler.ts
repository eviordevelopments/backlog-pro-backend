import { Injectable, Logger } from '@nestjs/common';

import { UserRepository } from '../../repository/user.repository';
import { JwtService } from '../services/jwt.service';

import { ConfirmEmailCommand } from './confirm-email.command';

export interface ConfirmEmailResult {
  success: boolean;
  message: string;
  token?: string;
  userId?: string;
  email?: string;
  name?: string;
}

@Injectable()
export class ConfirmEmailCommandHandler {
  private readonly logger = new Logger(ConfirmEmailCommandHandler.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async handle(command: ConfirmEmailCommand): Promise<ConfirmEmailResult> {
    this.logger.log(`Confirmando email con token: ${command.token.substring(0, 10)}...`);

    try {
      // Buscar usuario por token de confirmación
      const user = await this.userRepository.findByEmailConfirmationToken(command.token);

      if (!user) {
        return {
          success: false,
          message: 'Token de confirmación inválido o expirado.',
        };
      }

      if (user.isEmailVerified) {
        return {
          success: false,
          message: 'El email ya ha sido confirmado anteriormente.',
        };
      }

      // Confirmar email
      user.confirmEmail();
      await this.userRepository.update(user.id, user);

      this.logger.log(`Email confirmado exitosamente para usuario: ${user.id}`);

      // Generar token JWT para login automático
      const jwtToken = this.jwtService.generateToken(user.id, user.email);

      return {
        success: true,
        message: 'Email confirmado exitosamente. Ya puedes usar tu cuenta.',
        token: jwtToken,
        userId: user.id,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      this.logger.error(`Error confirmando email: ${(error as Error).message}`);
      return {
        success: false,
        message: 'Error interno del servidor. Por favor intenta más tarde.',
      };
    }
  }
}
