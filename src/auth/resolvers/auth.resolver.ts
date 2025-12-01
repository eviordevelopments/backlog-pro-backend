import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { SignupInput } from '@auth/dto/request/signup.dto';
import { SigninInput } from '@auth/dto/request/signin.dto';
import { RequestPasswordResetInput } from '@auth/dto/request/request-password-reset.dto';
import { AuthResponse } from '@auth/dto/response/auth.response.dto';
import { PasswordResetResponse } from '@auth/dto/response/password-reset.response.dto';
import { SignupCommandHandler } from '@auth/application/commands/signup.command-handler';
import { SigninCommandHandler } from '@auth/application/commands/signin.command-handler';
import { RequestPasswordResetCommandHandler } from '@auth/application/commands/request-password-reset.command-handler';
import { SignupCommand } from '@auth/application/commands/signup.command';
import { SigninCommand } from '@auth/application/commands/signin.command';
import { RequestPasswordResetCommand } from '@auth/application/commands/request-password-reset.command';

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  constructor(
    private readonly signupCommandHandler: SignupCommandHandler,
    private readonly signinCommandHandler: SigninCommandHandler,
    private readonly requestPasswordResetCommandHandler: RequestPasswordResetCommandHandler,
  ) {}

  @Mutation(() => AuthResponse, {
    description: 'Registra un nuevo usuario en el sistema',
  })
  async signup(@Args('input') input: SignupInput): Promise<AuthResponse> {
    this.logger.log(`Signup mutation called for email: ${input.email}`);
    const command = new SignupCommand(input.email, input.password, input.name);
    const user = await this.signupCommandHandler.handle(command);

    return {
      token: '', // El token se genera después del signup
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }

  @Mutation(() => AuthResponse, {
    description: 'Inicia sesión con email y contraseña',
  })
  async signin(@Args('input') input: SigninInput): Promise<AuthResponse> {
    this.logger.log(`Signin mutation called for email: ${input.email}`);
    const command = new SigninCommand(input.email, input.password);
    return this.signinCommandHandler.handle(command);
  }

  @Mutation(() => PasswordResetResponse, {
    description: 'Solicita un token para resetear la contraseña',
  })
  async requestPasswordReset(
    @Args('input') input: RequestPasswordResetInput,
  ): Promise<PasswordResetResponse> {
    this.logger.log(`Password reset requested for email: ${input.email}`);
    const command = new RequestPasswordResetCommand(input.email);
    return this.requestPasswordResetCommandHandler.handle(command);
  }
}
