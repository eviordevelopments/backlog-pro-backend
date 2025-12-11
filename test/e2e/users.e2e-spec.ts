import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../src/app.module';

describe('Users Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    // Create a test user and get auth token
    const email = `user-test-${Date.now()}@example.com`;
    const signupRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation Signup($input: SignupInput!) {
            signup(input: $input) {
              token
              userId
            }
          }
        `,
        variables: {
          input: {
            email,
            password: 'Test123456!',
            name: 'User Test',
          },
        },
      });

    authToken = signupRes.body.data.signup.token;
    userId = signupRes.body.data.signup.userId;
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
