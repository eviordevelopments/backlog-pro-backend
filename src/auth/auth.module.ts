import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserTypeOrmEntity } from '@auth/repository/entities/user.typeorm-entity';
import { UserRepository } from '@auth/repository/user.repository';
import { PasswordService } from '@auth/application/services/password.service';
import { JwtService } from '@auth/application/services/jwt.service';
import { SignupCommandHandler } from '@auth/application/commands/signup.command-handler';
import { SigninCommandHandler } from '@auth/application/commands/signin.command-handler';
import { RequestPasswordResetCommandHandler } from '@auth/application/commands/request-password-reset.command-handler';
import { AuthResolver } from '@auth/resolvers/auth.resolver';
import { UsersModule } from '@users/users.module';
import { envs } from '@shared/config';

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
