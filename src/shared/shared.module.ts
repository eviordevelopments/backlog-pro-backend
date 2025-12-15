import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { envs } from './config/envs.config';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { GraphQLLoggerPlugin } from './plugins/graphql-logger.plugin';
import { EmailService } from './services/email.service';
import { RelationshipValidatorService } from './services/relationship-validator.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: envs.jwt.secret,
      signOptions: { expiresIn: envs.jwt.expiresIn },
    }),
  ],
  providers: [
    GlobalExceptionFilter,
    GraphQLLoggerPlugin,
    RelationshipValidatorService,
    EmailService,
  ],
  exports: [
    JwtModule,
    GlobalExceptionFilter,
    GraphQLLoggerPlugin,
    RelationshipValidatorService,
    EmailService,
  ],
})
export class SharedModule {}
