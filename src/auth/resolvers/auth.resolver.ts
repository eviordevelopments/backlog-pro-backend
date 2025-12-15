import { Logger } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { ConfirmEmailCommandHandler } from '../application/commands/confirm-email.command-handler';
import { ConfirmEmailCommand } from '../application/commands/confirm-email.command';
import { RequestPasswordResetCommandHandler } from '../application/commands/request-password-reset.command-handler';
import { RequestPasswordResetCommand } from '../application/commands/request-password-reset.command';
import { SigninCommandHandler } from '../application/commands/signin.command-handler';
import { SigninCommand } from '../application/commands/signin.command';
import { SignupCommandHandler } from '../application/commands/signup.command-handler';
import { SignupCommand } from '../application/commands/signup.command';
import { RequestPasswordResetInput } from '../dto/request/request-password-reset.dto';
import { SigninInput } from '../dto/request/signin.dto';
import { SignupInput } from '../dto/request/signup.dto';
import { AuthResponse } from '../dto/response/auth.response.dto';
import { EmailConfirmationResponse } from '../dto/response/email-confirmation.response.dto';
import { PasswordResetResponse } from '../dto/response/password-reset.response.dto';
import { SignupResponse } from '../dto/response/signup.response.dto';

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  constructor(
    private readonly signupCommandHandler: SignupCommandHandler,
    private readonly signinCommandHandler: SigninCommandHandler,
    private readonly confirmEmailCommandHandler: ConfirmEmailCommandHandler,
    private readonly requestPasswordResetCommandHandler: RequestPasswordResetCommandHandler,
  ) {}

  @Mutation(() => SignupResponse, {
    description: 'Registra un nuevo usuario en el sistema',
  })
  async signup(@Args('input') input: SignupInput): Promise<SignupResponse> {
    try {
      this.logger.log(`Se solicitó una mutación de registro: ${input.email}`);
      const command = new SignupCommand(input.email, input.password, input.name);
      const result = await this.signupCommandHandler.handle(command);
      this.logger.log(`Registro exitoso para: ${input.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Error en registro para ${input.email}:`, error);
      throw error;
    }
  }

  @Mutation(() => AuthResponse, {
    description: 'Inicia sesión con email y contraseña',
  })
  async signin(@Args('input') input: SigninInput): Promise<AuthResponse> {
    this.logger.log(`Se solicitó una mutación de inicio de sesión: ${input.email}`);
    const command = new SigninCommand(input.email, input.password);
    return this.signinCommandHandler.handle(command);
  }

  @Mutation(() => EmailConfirmationResponse, {
    description: 'Confirma el email del usuario con el token recibido',
  })
  async confirmEmail(@Args('token') token: string): Promise<EmailConfirmationResponse> {
    this.logger.log(`Se solicitó confirmación de email con token: ${token.substring(0, 8)}...`);
    const command = new ConfirmEmailCommand(token);
    return this.confirmEmailCommandHandler.handle(command);
  }

  @Mutation(() => PasswordResetResponse, {
    description: 'Solicita un token para resetear la contraseña',
  })
  async requestPasswordReset(
    @Args('input') input: RequestPasswordResetInput,
  ): Promise<PasswordResetResponse> {
    this.logger.log(`Se solicitó una mutación de restablecimiento de contraseña: ${input.email}`);
    const command = new RequestPasswordResetCommand(input.email);
    return this.requestPasswordResetCommandHandler.handle(command);
  }
}
