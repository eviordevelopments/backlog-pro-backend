import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('Auth Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply same pipes as main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('signup', () => {
    it('should create a new user successfully', () => {
      const email = `test-${Date.now()}@example.com`;
      
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation Signup($input: SignupInput!) {
              signup(input: $input) {
                token
                userId
                email
                name
              }
            }
          `,
          variables: {
            input: {
              email,
              password: 'Test123456!',
              name: 'Test User',
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.signup).toBeDefined();
          expect(res.body.data.signup.token).toBeDefined();
          expect(res.body.data.signup.userId).toBeDefined();
          expect(res.body.data.signup.email).toBe(email);
          expect(res.body.data.signup.name).toBe('Test User');
          
          // Save for later tests
          authToken = res.body.data.signup.token;
          userId = res.body.data.signup.userId;
        });
    });

    it('should fail with invalid email', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation Signup($input: SignupInput!) {
              signup(input: $input) {
                token
              }
            }
          `,
          variables: {
            input: {
              email: 'invalid-email',
              password: 'Test123456!',
              name: 'Test User',
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });

    it('should fail with short password', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation Signup($input: SignupInput!) {
              signup(input: $input) {
                token
              }
            }
          `,
          variables: {
            input: {
              email: 'test@example.com',
              password: '123',
              name: 'Test User',
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });
  });

  describe('signin', () => {
    const testEmail = `signin-test-${Date.now()}@example.com`;
    const testPassword = 'Test123456!';

    beforeAll(async () => {
      // Create a user first
      await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation Signup($input: SignupInput!) {
              signup(input: $input) {
                token
              }
            }
          `,
          variables: {
            input: {
              email: testEmail,
              password: testPassword,
              name: 'Signin Test User',
            },
          },
        });
    });

    it('should login successfully with correct credentials', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation Signin($input: SigninInput!) {
              signin(input: $input) {
                token
                userId
                email
                name
              }
            }
          `,
          variables: {
            input: {
              email: testEmail,
              password: testPassword,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.signin).toBeDefined();
          expect(res.body.data.signin.token).toBeDefined();
          expect(res.body.data.signin.email).toBe(testEmail);
        });
    });

    it('should fail with incorrect password', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation Signin($input: SigninInput!) {
              signin(input: $input) {
                token
              }
            }
          `,
          variables: {
            input: {
              email: testEmail,
              password: 'WrongPassword123!',
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });

    it('should fail with non-existent email', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation Signin($input: SigninInput!) {
              signin(input: $input) {
                token
              }
            }
          `,
          variables: {
            input: {
              email: 'nonexistent@example.com',
              password: testPassword,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });
  });
});
