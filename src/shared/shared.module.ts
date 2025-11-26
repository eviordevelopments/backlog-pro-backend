import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './guards';
import { GlobalExceptionFilter } from './filters';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [JwtAuthGuard, GlobalExceptionFilter],
  exports: [JwtAuthGuard, GlobalExceptionFilter],
})
export class SharedModule {}