import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { UserProfile } from '../../../users/domain/entities/user-profile.entity';
import { UserProfileRepository } from '../../../users/repository/user-profile.repository';
import { User } from '../../domain/entities/user.entity';
import { EmailAlreadyRegisteredException } from '../../domain/exceptions/index';
import { Email } from '../../domain/value-objects/email.vo';
import { UserRepository } from '../../repository/user.repository';
import { JwtService } from '../services/jwt.service';
import { PasswordService } from '../services/password.service';

import { SignupCommand } from './signup.command';

export interface SignupResult {
  token: string;
  userId: string;
  email: string;
  name: string;
}

@Injectable()
export class SignupCommandHandler {
  private readonly logger = new Logger(SignupCommandHandler.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly userProfileRepository: UserProfileRepository,
  ) {}

  async handle(command: SignupCommand): Promise<SignupResult> {
    this.logger.log(`Iniciando registro de usuario con email: ${command.email}`);

    // Validar email
    new Email(command.email);

    // Verificar que el email no esté registrado
    const emailExists = await this.userRepository.existsByEmail(command.email);
    if (emailExists) {
      throw new EmailAlreadyRegisteredException(command.email);
    }

    // Hash de la contraseña
    const passwordHash = await this.passwordService.hashPassword(command.password);

    // Crear usuario
    const user = new User({
      id: uuidv4(),
      email: command.email,
      passwordHash,
      name: command.name,
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

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

    // Generar JWT token
    const token = this.jwtService.generateToken(createdUser.id, createdUser.email);

    return {
      token,
      userId: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
    };
  }
}
