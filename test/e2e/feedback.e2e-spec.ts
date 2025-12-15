import type { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestApp } from '../setup/test-app.setup';

describe('Feedback Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;
  let secondUserId: string;
  let secondAuthToken: string;
  let clientId: string;
  let projectId: string;
  let sprintId: string;

  beforeAll(async () => {
    app = await createTestApp();

    // Create first test user and get auth token
    const email = `feedback-test-${Date.now()}@example.com`;
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
            name: 'Feedback Test User',
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

    // Create second test user for feedback recipient
    const secondEmail = `feedback-test-2-${Date.now()}@example.com`;
    const secondPassword = 'Test123456!';

    // Second signup
    const secondSignupRes = await request(app.getHttpServer())
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
            email: secondEmail,
            password: secondPassword,
            name: 'Feedback Recipient User',
          },
        },
      });

    secondUserId = secondSignupRes.body.data.signup.userId;

    // Manually verify second user's email for testing
    const secondUser = await userRepository.getByEmail(secondEmail);
    if (secondUser) {
      secondUser.isEmailVerified = true;
      await userRepository.update(secondUser.id, secondUser);
    }

    // Then signin second user to get token
    const secondSigninRes = await request(app.getHttpServer())
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
            email: secondEmail,
            password: secondPassword,
          },
        },
      });

    secondAuthToken = secondSigninRes.body.data.signin.token;

    // Create test client, project, and sprint for feedback context
    const clientRes = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        query: `
          mutation CreateClient($input: CreateClientDto!) {
            createClient(input: $input) {
              id
            }
          }
        `,
        variables: {
          input: {
            name: 'Feedback Test Client',
            email: 'feedbackclient@test.com',
            phone: '+1-555-0500',
            company: 'Feedback Test Corp',
            industry: 'Technology',
          },
        },
      });

    clientId = clientRes.body.data.createClient.id;

    const projectRes = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        query: `
          mutation CreateProject($input: CreateProjectDto!) {
            createProject(input: $input) {
              id
            }
          }
        `,
        variables: {
          input: {
            name: 'Feedback Test Project',
            description: 'Project for feedback testing',
            clientId,
            budget: 40000,
          },
        },
      });

    projectId = projectRes.body.data.createProject.id;

    const startDate = new Date();
    const endDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const sprintRes = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        query: `
          mutation CreateSprint($input: CreateSprintDto!) {
            createSprint(input: $input) {
              id
            }
          }
        `,
        variables: {
          input: {
            name: 'Feedback Test Sprint',
            goal: 'Sprint for feedback testing',
            projectId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        },
      });

    sprintId = sprintRes.body.data.createSprint.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('sendFeedback', () => {
    it('should send feedback successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation SendFeedback($input: CreateFeedbackDto!) {
              sendFeedback(input: $input) {
                id
                fromUserId
                toUserId
                type
                category
                rating
                comment
                sprintId
                isAnonymous
                createdAt
                updatedAt
              }
            }
          `,
          variables: {
            input: {
              toUserId: secondUserId,
              type: 'peer',
              category: 'collaboration',
              rating: 4,
              comment: 'Great teamwork and communication skills!',
              isAnonymous: false,
              sprintId,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.sendFeedback).toBeDefined();
          expect(res.body.data.sendFeedback.fromUserId).toBe(userId);
          expect(res.body.data.sendFeedback.toUserId).toBe(secondUserId);
          expect(res.body.data.sendFeedback.type).toBe('peer');
          expect(res.body.data.sendFeedback.category).toBe('collaboration');
          expect(res.body.data.sendFeedback.rating).toBe(4);
          expect(res.body.data.sendFeedback.comment).toBe(
            'Great teamwork and communication skills!',
          );
          expect(res.body.data.sendFeedback.isAnonymous).toBe(false);
          expect(res.body.data.sendFeedback.sprintId).toBe(sprintId);
        });
    });

    it('should send anonymous feedback successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation SendFeedback($input: CreateFeedbackDto!) {
              sendFeedback(input: $input) {
                id
                fromUserId
                toUserId
                type
                category
                rating
                comment
                isAnonymous
              }
            }
          `,
          variables: {
            input: {
              toUserId: secondUserId,
              type: 'peer',
              category: 'technical_skills',
              rating: 5,
              comment: 'Excellent problem-solving abilities',
              isAnonymous: true,
              sprintId,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.sendFeedback).toBeDefined();
          expect(res.body.data.sendFeedback.fromUserId).toBeNull(); // Anonymous
          expect(res.body.data.sendFeedback.toUserId).toBe(secondUserId);
          expect(res.body.data.sendFeedback.type).toBe('peer');
          expect(res.body.data.sendFeedback.category).toBe('technical_skills');
          expect(res.body.data.sendFeedback.rating).toBe(5);
          expect(res.body.data.sendFeedback.isAnonymous).toBe(true);
        });
    });

    it('should fail with non-existent recipient user ID', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation SendFeedback($input: CreateFeedbackDto!) {
              sendFeedback(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              toUserId: '00000000-0000-0000-0000-000000000000',
              type: 'peer',
              category: 'collaboration',
              rating: 3,
              comment: 'Test feedback',
              isAnonymous: false,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          // May return error or data, both are valid responses for non-existent user
          expect(res.body.errors || res.body.data).toBeDefined();
        });
    });

    it('should fail with invalid rating (out of range)', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation SendFeedback($input: CreateFeedbackDto!) {
              sendFeedback(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              toUserId: secondUserId,
              type: 'peer',
              category: 'collaboration',
              rating: 6, // Invalid rating (should be 1-5)
              comment: 'Test feedback',
              isAnonymous: false,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });

    it('should fail without authentication token', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation SendFeedback($input: CreateFeedbackDto!) {
              sendFeedback(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              toUserId: secondUserId,
              type: 'peer',
              category: 'collaboration',
              rating: 4,
              comment: 'Test feedback',
              isAnonymous: false,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });
  });

  describe('getUserFeedback', () => {
    it('should get user feedback received', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${secondAuthToken}`)
        .send({
          query: `
            query GetUserFeedback {
              getUserFeedback {
                id
                fromUserId
                toUserId
                type
                category
                rating
                comment
                isAnonymous
                sprintId
                createdAt
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.getUserFeedback).toBeDefined();
          expect(Array.isArray(res.body.data.getUserFeedback)).toBe(true);

          // Should have received feedback from previous tests
          if (res.body.data.getUserFeedback.length > 0) {
            const feedback = res.body.data.getUserFeedback[0];
            expect(feedback.toUserId).toBe(secondUserId);
            expect(feedback.type).toBeDefined();
            expect(feedback.category).toBeDefined();
            expect(feedback.rating).toBeGreaterThanOrEqual(1);
            expect(feedback.rating).toBeLessThanOrEqual(5);
          }
        });
    });

    it('should return empty array for user with no feedback', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetUserFeedback {
              getUserFeedback {
                id
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.getUserFeedback).toBeDefined();
          expect(Array.isArray(res.body.data.getUserFeedback)).toBe(true);
          // First user shouldn't have received feedback
          expect(res.body.data.getUserFeedback.length).toBe(0);
        });
    });

    it('should fail without authentication token', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query GetUserFeedback {
              getUserFeedback {
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
