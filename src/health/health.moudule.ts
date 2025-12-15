import { Module } from '@nestjs/common';

import { EmailService } from '../shared/services/email.service';
import { EmailHealthIndicator } from './email-health.indicator';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  providers: [EmailService, EmailHealthIndicator],
})
export class HealthModule {}
