import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { envs } from './config/index';
import { GlobalExceptionFilter } from './filters/index';
import { GraphQLLoggerPlugin } from './plugins/index';
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
  providers: [GlobalExceptionFilter, GraphQLLoggerPlugin, RelationshipValidatorService],
  exports: [JwtModule, GlobalExceptionFilter, GraphQLLoggerPlugin, RelationshipValidatorService],
})
export class SharedModule {}
