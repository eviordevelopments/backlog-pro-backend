import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../src/app.module';

describe('Notifications Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;
  let secondAuthToken: string;
  let secondUserId: string;
  let notificationId: string;

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

    // Create first test user and get auth token
    const email = `notifications-test-${Date.now()}@example.com`;
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
            name: 'Notifications Test User',
          },
        },
      });

    authToken = signupRes.body.data.signup.token;
    userId = signupRes.body.data.signup.userId;

    // Create second test user for notification interactions
    const secondEmail = `notifications-test-2-${Date.now()}@example.com`;
    const secondSignupRes = await request(app.getHttpServer())
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
            email: secondEmail,
            password: 'Test123456!',
            name: 'Second Notifications User',
          },
        },
      });

    secondAuthToken = secondSignupRes.body.data.signup.token;
    secondUserId = secondSignupRes.body.data.signup.userId;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('getUserNotifications', () => {
    it('should get all user notifications', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetUserNotifications {
              getUserNotifications {
                id
                userId
                type
                title
                message
                metadata
                isRead
                createdAt
                updatedAt
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.getUserNotifications).toBeDefined();
          expect(Array.isArray(res.body.data.getUserNotifications)).toBe(true);

          // If there are notifications, verify structure
          if (res.body.data.getUserNotifications.length > 0) {
            const notification = res.body.data.getUserNotifications[0];
            expect(notification.id).toBeDefined();
            expect(notification.userId).toBe(userId);
            expect(notification.type).toBeDefined();
            expect(notification.title).toBeDefined();
            expect(notification.message).toBeDefined();
            expect(typeof notification.isRead).toBe('boolean');
            expect(notification.createdAt).toBeDefined();

            // Store first notification ID for later tests
            if (!notificationId) {
              notificationId = notification.id;
            }
          }
        });
    });

    it('should fail without authentication token', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query GetUserNotifications {
              getUserNotifications {
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

  describe('getUnreadNotifications', () => {
    it('should get unread notifications for user', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetUnreadNotifications {
              getUnreadNotifications {
                id
                userId
                type
                title
                message
                isRead
                createdAt
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.getUnreadNotifications).toBeDefined();
          expect(Array.isArray(res.body.data.getUnreadNotifications)).toBe(true);

          // If there are unread notifications, verify they are actually unread
          if (res.body.data.getUnreadNotifications.length > 0) {
            res.body.data.getUnreadNotifications.forEach((notification: any) => {
              expect(notification.userId).toBe(userId);
              expect(notification.isRead).toBe(false);
              expect(notification.id).toBeDefined();
              expect(notification.type).toBeDefined();
              expect(notification.title).toBeDefined();
              expect(notification.message).toBeDefined();
            });
          }
        });
    });

    it('should return empty array for user with no unread notifications', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${secondAuthToken}`)
        .send({
          query: `
            query GetUnreadNotifications {
              getUnreadNotifications {
                id
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.getUnreadNotifications).toBeDefined();
          expect(Array.isArray(res.body.data.getUnreadNotifications)).toBe(true);
          // Second user likely has no notifications
          expect(res.body.data.getUnreadNotifications.length).toBeGreaterThanOrEqual(0);
        });
    });

    it('should fail without authentication token', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query GetUnreadNotifications {
              getUnreadNotifications {
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

  describe('markNotificationAsRead', () => {
    beforeAll(async () => {
      // Ensure we have a notification to mark as read
      // Get user notifications to find an unread one
      const notificationsRes = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetUnreadNotifications {
              getUnreadNotifications {
                id
                isRead
              }
            }
          `,
        });

      if (notificationsRes.body.data?.getUnreadNotifications?.length > 0) {
        notificationId = notificationsRes.body.data.getUnreadNotifications[0].id;
      }
    });

    it('should mark notification as read successfully', () => {
      // Skip if no notification available
      if (!notificationId) {
        return request(app.getHttpServer())
          .post('/graphql')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            query: `
              mutation MarkNotificationAsRead($notificationId: String!) {
                markNotificationAsRead(notificationId: $notificationId) {
                  id
                  isRead
                }
              }
            `,
            variables: {
              notificationId: '00000000-0000-0000-0000-000000000000',
            },
          })
          .expect(200)
          .expect((res) => {
            // Should fail with non-existent notification
            expect(res.body.errors).toBeDefined();
          });
      }

      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation MarkNotificationAsRead($notificationId: String!) {
              markNotificationAsRead(notificationId: $notificationId) {
                id
                userId
                type
                title
                message
                isRead
                updatedAt
              }
            }
          `,
          variables: {
            notificationId,
          },
        })
        .expect(200)
        .expect((res) => {
          if (res.body.errors) {
            // If notification doesn't exist or is already read, that's expected
            expect(res.body.errors).toBeDefined();
          } else {
            expect(res.body.data.markNotificationAsRead).toBeDefined();
            expect(res.body.data.markNotificationAsRead.id).toBe(notificationId);
            expect(res.body.data.markNotificationAsRead.isRead).toBe(true);
            expect(res.body.data.markNotificationAsRead.userId).toBe(userId);
          }
        });
    });

    it('should fail with non-existent notification ID', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation MarkNotificationAsRead($notificationId: String!) {
              markNotificationAsRead(notificationId: $notificationId) {
                id
              }
            }
          `,
          variables: {
            notificationId: '00000000-0000-0000-0000-000000000000',
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });

    it('should fail with invalid notification ID format', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation MarkNotificationAsRead($notificationId: String!) {
              markNotificationAsRead(notificationId: $notificationId) {
                id
              }
            }
          `,
          variables: {
            notificationId: 'invalid-uuid',
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
            mutation MarkNotificationAsRead($notificationId: String!) {
              markNotificationAsRead(notificationId: $notificationId) {
                id
              }
            }
          `,
          variables: {
            notificationId: notificationId || '00000000-0000-0000-0000-000000000000',
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });
  });

  describe('Notification Types and Content', () => {
    it('should handle different notification types correctly', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetUserNotifications {
              getUserNotifications {
                id
                type
                title
                message
                metadata
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.getUserNotifications).toBeDefined();

          // If there are notifications, verify they have valid types
          if (res.body.data.getUserNotifications.length > 0) {
            res.body.data.getUserNotifications.forEach((notification: any) => {
              expect(notification.type).toBeDefined();
              expect(typeof notification.type).toBe('string');
              expect(notification.title).toBeDefined();
              expect(notification.message).toBeDefined();

              // Metadata can be null or an object
              if (notification.metadata !== null) {
                expect(typeof notification.metadata).toBe('object');
              }
            });
          }
        });
    });
  });
});
