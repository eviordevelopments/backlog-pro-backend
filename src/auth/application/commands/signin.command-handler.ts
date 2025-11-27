import { Injectable, Logger } from '@nestjs/common';
import { SigninCommand } from './signin.command';
import { InvalidCredentialsException, UserNotFoundException } from '../../domain/exceptions';
import { UserRepository } from '../../repository/user.repository';
import { PasswordService } from '../services/password.service';
import { JwtService } from '../services/jwt.service';

export interface SigninResult {
  token: string;
  userId: string;
  email: string;
  name: string;
}

@Injectable()
export class SigninCommandHandler {
  private readonly logger = new Logger(SigninCommandHandler.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async handle(command: SigninCommand): Promise<SigninResult> {
    this.logger.log(`Iniciando sesión para usuario: ${command.email}`);

    // Obtener usuario por email
    const user = await this.userRepository.getByEmail(command.email);
    if (!user) {
      throw new UserNotFoundException(command.email);
    }

    // Validar contraseña
    const isPasswordValid = await this.passwordService.comparePassword(
      command.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    // Generar JWT token
    const token = this.jwtService.generateToken(user.id, user.email);

    this.logger.log(`Sesión iniciada exitosamente para usuario: ${user.id}`);

    return {
      token,
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
