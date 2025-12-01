import { Injectable, Logger } from '@nestjs/common';
import { RequestPasswordResetCommand } from '@auth/application/commands/request-password-reset.command';
import { UserNotFoundException } from '@auth/domain/exceptions';
import { UserRepository } from '@auth/repository/user.repository';
import { JwtService } from '@auth/application/services/jwt.service';

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
