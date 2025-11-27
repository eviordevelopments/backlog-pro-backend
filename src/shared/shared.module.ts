import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GlobalExceptionFilter } from './filters';
import { GraphQLLoggerPlugin } from './plugins';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [JwtService, GlobalExceptionFilter, GraphQLLoggerPlugin],
  exports: [JwtService, GlobalExceptionFilter, GraphQLLoggerPlugin],
})
export class SharedModule {}
