import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { EmailAlreadyRegisteredException } from '../../domain/exceptions/email-already-registered.exception';
import { EmailService } from '../../../shared/services/email.service';
import { UserProfile } from '../../../users/domain/entities/user-profile.entity';
import { UserProfileRepository } from '../../../users/repository/user-profile.repository';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { UserRepository } from '../../repository/user.repository';
import { JwtService } from '../services/jwt.service';
import { PasswordService } from '../services/password.service';
import { SignupCommand } from './signup.command';

export interface SignupResult {
  userId: string;
  email: string;
  name: string;
  message: string;
  requiresEmailConfirmation: boolean;
}

@Injectable()
export class SignupCommandHandler {
  private readonly logger = new Logger(SignupCommandHandler.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly emailService: EmailService,
  ) {}

  async handle(command: SignupCommand): Promise<SignupResult> {
    try {
      this.logger.log(`Iniciando registro de usuario con email: ${command.email}`);

      // Validar email
      this.logger.log(`Validando email: ${command.email}`);
      new Email(command.email);
      this.logger.log(`Email válido: ${command.email}`);

      // Verificar que el email no esté registrado
      this.logger.log(`Verificando si el email existe: ${command.email}`);
      const emailExists = await this.userRepository.existsByEmail(command.email);
      if (emailExists) {
        throw new EmailAlreadyRegisteredException(command.email);
      }
      this.logger.log(`Email no existe, continuando: ${command.email}`);

      // Hash de la contraseña
      this.logger.log(`Hasheando contraseña para: ${command.email}`);
      const passwordHash = await this.passwordService.hashPassword(command.password);
      this.logger.log(`Contraseña hasheada para: ${command.email}`);

      // Crear usuario
      const user = new User({
        id: uuidv4(),
        email: command.email,
        passwordHash,
        name: command.name,
        // En producción sin emails, auto-verificar para permitir login inmediato
        isEmailVerified: process.env.DISABLE_EMAILS === 'true' ? true : false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Generar token de confirmación
      const confirmationToken = user.generateEmailConfirmationToken();

      const createdUser = await this.userRepository.create(user);
      this.logger.log(`Usuario registrado exitosamente: ${createdUser.id}`);

      // Crear perfil de usuario automáticamente
      try {
        const userProfile = new UserProfile(
          createdUser.id,
          command.name,
          command.email,
          undefined,
          [],
          0,
          uuidv4(),
          new Date(),
          new Date(),
        );

        await this.userProfileRepository.create(userProfile);
        this.logger.log(`Perfil de usuario creado exitosamente: ${createdUser.id}`);
      } catch (error) {
        this.logger.error(`Error al crear perfil de usuario: ${(error as Error).message}`);
        // No lanzar error, el usuario se creó correctamente
      }

      // Enviar email de confirmación
      try {
        await this.emailService.sendConfirmationEmail(createdUser.email, confirmationToken);
        this.logger.log(`Email de confirmación enviado a: ${createdUser.email}`);
      } catch (error) {
        this.logger.error(`Error enviando email de confirmación: ${(error as Error).message}`);
        // No lanzar error, el usuario se creó correctamente
      }

      return {
        userId: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        message:
          'Usuario registrado exitosamente. Por favor revisa tu email para confirmar tu cuenta.',
        requiresEmailConfirmation: true,
      };
    } catch (error) {
      this.logger.error(`Error en signup handler para ${command.email}:`, error);
      throw error;
    }
  }
}
