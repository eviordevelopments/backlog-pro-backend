import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { SignupCommand } from '@auth/application/commands/signup.command';
import { User } from '@auth/domain/entities/user.entity';
import { Email } from '@auth/domain/value-objects/email.vo';
import { EmailAlreadyRegisteredException } from '@auth/domain/exceptions';
import { UserRepository } from '@auth/repository/user.repository';
import { PasswordService } from '@auth/application/services/password.service';
import { JwtService } from '@auth/application/services/jwt.service';
import { UserProfileRepository } from '@users/repository/user-profile.repository';
import { UserProfile } from '@users/domain/entities/user-profile.entity';

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
      const userProfile = new UserProfile({
        id: uuidv4(),
        userId: createdUser.id,
        name: command.name,
        email: command.email,
        avatar: null,
        skills: [],
        hourlyRate: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await this.userProfileRepository.create(userProfile);
      this.logger.log(`Perfil de usuario creado exitosamente: ${createdUser.id}`);
    } catch (error) {
      this.logger.error(`Error al crear perfil de usuario: ${error.message}`);
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
