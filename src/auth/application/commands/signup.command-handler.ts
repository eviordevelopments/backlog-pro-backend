import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { SignupCommand } from './signup.command';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { EmailAlreadyRegisteredException } from '../../domain/exceptions';
import { UserRepository } from '../../repository/user.repository';
import { PasswordService } from '../services/password.service';

@Injectable()
export class SignupCommandHandler {
  private readonly logger = new Logger(SignupCommandHandler.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async handle(command: SignupCommand): Promise<User> {
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

    return createdUser;
  }
}
