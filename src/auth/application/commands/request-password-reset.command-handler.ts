import { Injectable, Logger } from '@nestjs/common';

import { UserNotFoundException } from '../../domain/exceptions/index';
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

    return {
      resetToken,
      expiresIn: '1h',
    };
  }
}
