import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/healthz (GET)', () => {
    return request(app.getHttpServer())
      .get('/healthz')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
        expect(res.body.timestamp).toBeDefined();
      });
  });

  it('/readyz (GET)', () => {
    return request(app.getHttpServer())
      .get('/readyz')
      .expect(200)
      .expect((res) => {
        // En entorno de test, puede devolver ready: false con reason
        expect(typeof res.body.ready).toBe('boolean');
        if (res.body.ready === false) {
          expect(res.body.reason).toBeDefined();
        } else {
          expect(typeof res.body.database).toBe('boolean');
          expect(res.body.timestamp).toBeDefined();
        }
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
