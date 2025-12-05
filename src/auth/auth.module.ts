import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { envs } from '../shared/config/index';
import { UsersModule } from '../users/users.module';

import { RequestPasswordResetCommandHandler } from './application/commands/request-password-reset.command-handler';
import { SigninCommandHandler } from './application/commands/signin.command-handler';
import { SignupCommandHandler } from './application/commands/signup.command-handler';
import { JwtService } from './application/services/jwt.service';
import { PasswordService } from './application/services/password.service';
import { UserTypeOrmEntity } from './repository/entities/user.typeorm-entity';
import { UserRepository } from './repository/user.repository';
import { AuthResolver } from './resolvers/auth.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTypeOrmEntity]),
    JwtModule.register({
      secret: envs.jwt.secret,
      signOptions: { expiresIn: envs.jwt.expiresIn },
    }),
    UsersModule,
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
