import type { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestApp } from '../setup/test-app.setup';

describe('Users Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    app = await createTestApp();

    // Create a test user and get auth token
    const email = `user-test-${Date.now()}@example.com`;
    const password = 'Test123456!';

    // First signup
    const signupRes = await request(app.getHttpServer())
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
            password,
            name: 'User Test',
          },
        },
      });

    userId = signupRes.body.data.signup.userId;

    // Manually verify email for testing
    const { UserRepository } = await import('../../src/auth/repository/user.repository');
    const userRepository = app.get(UserRepository);
    const user = await userRepository.getByEmail(email);
    if (user) {
      user.isEmailVerified = true;
      await userRepository.update(user.id, user);
    }

    // Then signin to get token
    const signinRes = await request(app.getHttpServer())
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
            email,
            password,
          },
        },
      });

    authToken = signinRes.body.data.signin.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('getProfile', () => {
    it('should get user profile with valid token', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetProfile {
              getProfile {
                id
                userId
                name
                email
                avatar
                skills
                hourlyRate
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.getProfile).toBeDefined();
          expect(res.body.data.getProfile.userId).toBe(userId);
          expect(res.body.data.getProfile.name).toBe('User Test');
        });
    });

    it('should fail without authentication token', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query GetProfile {
              getProfile {
                id
                name
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation UpdateProfile($input: UpdateProfileDto!) {
              updateProfile(input: $input) {
                id
                name
                skills
                hourlyRate
              }
            }
          `,
          variables: {
            input: {
              name: 'Updated User Name',
              skills: ['NestJS', 'GraphQL', 'TypeScript'],
              hourlyRate: 75,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.updateProfile).toBeDefined();
          expect(res.body.data.updateProfile.name).toBe('Updated User Name');
          expect(res.body.data.updateProfile.skills).toEqual(['NestJS', 'GraphQL', 'TypeScript']);
          expect(res.body.data.updateProfile.hourlyRate).toBe(75);
        });
    });

    it('should fail with invalid hourly rate', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation UpdateProfile($input: UpdateProfileDto!) {
              updateProfile(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              hourlyRate: -10,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });
  });

  describe('updateAvatar', () => {
    it('should update avatar successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation UpdateAvatar($input: UpdateAvatarDto!) {
              updateAvatar(input: $input) {
                id
                avatar
              }
            }
          `,
          variables: {
            input: {
              avatarUrl: 'https://example.com/avatar.jpg',
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.updateAvatar).toBeDefined();
          expect(res.body.data.updateAvatar.avatar).toBe('https://example.com/avatar.jpg');
        });
    });
  });

  describe('getWorkedHours', () => {
    it('should get worked hours without project filter', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetWorkedHours {
              getWorkedHours {
                userId
                totalHours
                projectId
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.getWorkedHours).toBeDefined();
          expect(res.body.data.getWorkedHours.totalHours).toBeGreaterThanOrEqual(0);
        });
    });

    it('should get worked hours with project filter', () => {
      const projectId = '00000000-0000-0000-0000-000000000000';

      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetWorkedHours($projectId: String) {
              getWorkedHours(projectId: $projectId) {
                userId
                totalHours
                projectId
              }
            }
          `,
          variables: {
            projectId,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.getWorkedHours).toBeDefined();
          expect(res.body.data.getWorkedHours.projectId).toBe(projectId);
        });
    });
  });
});
