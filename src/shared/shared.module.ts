import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { GlobalExceptionFilter } from '@shared/filters';
import { GraphQLLoggerPlugin } from '@shared/plugins';
import { envs } from '@shared/config';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: envs.jwt.secret,
      signOptions: { expiresIn: envs.jwt.expiresIn },
    }),
  ],
  providers: [GlobalExceptionFilter, GraphQLLoggerPlugin],
  exports: [JwtModule, GlobalExceptionFilter, GraphQLLoggerPlugin],
})
export class SharedModule {}
