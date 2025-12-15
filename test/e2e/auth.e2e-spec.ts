import type { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { UserRepository } from '../../src/auth/repository/user.repository';
import { MockEmailService } from '../mocks/email.service.mock';
import { createTestApp, getMockEmailService } from '../setup/test-app.setup';

describe('Auth Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;
  let mockEmailService: MockEmailService;

  beforeAll(async () => {
    app = await createTestApp();
    mockEmailService = getMockEmailService(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('signup', () => {
    beforeEach(() => {
      // Clear sent emails before each test
      mockEmailService.clearSentEmails();
    });

    it('should create a new user successfully and send confirmation email', () => {
      const email = `test-${Date.now()}@example.com`;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation Signup($input: SignupInput!) {
              signup(input: $input) {
                userId
                email
                name
                message
                requiresEmailConfirmation
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
          expect(res.body.data.signup.userId).toBeDefined();
          expect(res.body.data.signup.email).toBe(email);
          expect(res.body.data.signup.name).toBe('Test User');
          expect(res.body.data.signup.message).toBeDefined();
          expect(typeof res.body.data.signup.requiresEmailConfirmation).toBe('boolean');

          // Verify that confirmation email was sent
          expect(mockEmailService.getSentEmailsCount()).toBe(1);
          const sentEmail = mockEmailService.getLastSentEmail();
          expect(sentEmail?.to).toBe(email);
          expect(sentEmail?.subject).toBe('Confirma tu email - Backlog Pro');

          // Save for later tests
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
                userId
                email
                name
                message
                requiresEmailConfirmation
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
                userId
                email
                name
                message
                requiresEmailConfirmation
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
      const signupResponse = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation Signup($input: SignupInput!) {
              signup(input: $input) {
                userId
                email
                name
                message
                requiresEmailConfirmation
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

      // For testing purposes, we need to manually verify the email
      // In a real scenario, the user would click the confirmation link
      // Here we'll directly update the user to be verified
      const userRepository = app.get(UserRepository);
      const user = await userRepository.getByEmail(testEmail);
      if (user) {
        user.isEmailVerified = true;
        await userRepository.update(user.id, user);
      }
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
                userId
                email
                name
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
                userId
                email
                name
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
