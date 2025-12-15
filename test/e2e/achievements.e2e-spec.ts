import type { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestApp } from '../setup/test-app.setup';

describe('Achievements Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    app = await createTestApp();

    // Create test user and get auth token
    const email = `achievements-test-${Date.now()}@example.com`;
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
            name: 'Achievements Test User',
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

  describe('getAvailableAchievements', () => {
    it('should get all available achievements', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetAvailableAchievements {
              getAvailableAchievements {
                id
                name
                description
                icon
                category
                points
                rarity
                requirement
                createdAt
                updatedAt
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.getAvailableAchievements).toBeDefined();
          expect(Array.isArray(res.body.data.getAvailableAchievements)).toBe(true);

          // If there are achievements, verify structure
          if (res.body.data.getAvailableAchievements.length > 0) {
            const achievement = res.body.data.getAvailableAchievements[0];
            expect(achievement.id).toBeDefined();
            expect(achievement.name).toBeDefined();
            expect(achievement.description).toBeDefined();
            expect(achievement.category).toBeDefined();
            expect(achievement.points).toBeDefined();
            expect(achievement.rarity).toBeDefined();
          }
        });
    });

    it('should fail without authentication token', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query GetAvailableAchievements {
              getAvailableAchievements {
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

  describe('getUserAchievements', () => {
    it('should get user achievements', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetUserAchievements {
              getUserAchievements {
                id
                userId
                achievementId
                unlockedAt
                createdAt
                achievement {
                  id
                  name
                  description
                  category
                  points
                  rarity
                }
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.getUserAchievements).toBeDefined();
          expect(Array.isArray(res.body.data.getUserAchievements)).toBe(true);

          // If there are user achievements, verify structure
          if (res.body.data.getUserAchievements.length > 0) {
            const userAchievement = res.body.data.getUserAchievements[0];
            expect(userAchievement.id).toBeDefined();
            expect(userAchievement.userId).toBe(userId);
            expect(userAchievement.achievementId).toBeDefined();
            expect(userAchievement.achievement).toBeDefined();
            expect(userAchievement.achievement.name).toBeDefined();
          }
        });
    });

    it('should fail without authentication token', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query GetUserAchievements {
              getUserAchievements {
                id
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
});
