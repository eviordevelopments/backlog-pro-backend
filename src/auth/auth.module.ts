import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserTypeOrmEntity } from './repository/entities/user.typeorm-entity';
import { UserRepository } from './repository/user.repository';
import { PasswordService } from './application/services/password.service';
import { JwtService } from './application/services/jwt.service';
import { SignupCommandHandler } from './application/commands/signup.command-handler';
import { SigninCommandHandler } from './application/commands/signin.command-handler';
import { RequestPasswordResetCommandHandler } from './application/commands/request-password-reset.command-handler';
import { AuthResolver } from './resolvers/auth.resolver';
import { envs } from '../shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTypeOrmEntity]),
    JwtModule.register({
      secret: envs.jwt.secret,
      signOptions: { expiresIn: envs.jwt.expiresIn },
    }),
  ],
  providers: [
    UserRepository,
    PasswordService,
    JwtService,
    SignupCommandHandler,
    SigninCommandHandler,
    RequestPasswordResetCommandHandler,
    AuthResolver,
  ],
  exports: [UserRepository, JwtService, PasswordService],
})
export class AuthModule {}
