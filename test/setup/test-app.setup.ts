import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';
import { EmailService } from '../../src/shared/services/email.service';
import { MockEmailService } from '../mocks/email.service.mock';

export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(EmailService)
    .useClass(MockEmailService)
    .compile();

  const app = moduleFixture.createNestApplication();

  // Apply same pipes as main.ts
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();
  return app;
}

export function getMockEmailService(app: INestApplication): MockEmailService {
  return app.get<MockEmailService>(EmailService);
}
