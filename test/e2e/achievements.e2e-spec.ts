import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../src/app.module';

describe('Achievements Module (e2e)', () => {
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

    // Create test user and get auth token
    const email = `achievements-test-${Date.now()}@example.com`;
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
            name: 'Achievements Test User',
          },
        },
      });

    authToken = signupRes.body.data.signup.token;
    userId = signupRes.body.data.signup.userId;
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
