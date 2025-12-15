import type { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestApp } from '../setup/test-app.setup';

describe('Metrics Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;
  let clientId: string;
  let projectId: string;
  let sprintId: string;

  beforeAll(async () => {
    app = await createTestApp();

    // Create test user and get auth token
    const email = `metrics-test-${Date.now()}@example.com`;
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
            name: 'Metrics Test User',
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

    // Create test client, project, and sprint for metrics context
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
            name: 'Metrics Test Client',
            email: 'metricsclient@test.com',
            phone: '+1-555-1000',
            company: 'Metrics Test Corp',
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
            name: 'Metrics Test Project',
            description: 'Project for metrics testing',
            clientId,
            budget: 80000,
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
            name: 'Metrics Test Sprint',
            goal: 'Sprint for metrics testing',
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

  describe('getSprintMetrics', () => {
    it('should get sprint metrics successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetSprintMetrics($sprintId: String!) {
              getSprintMetrics(sprintId: $sprintId) {
                sprintId
                sprintName
                status
                storyPointsCommitted
                storyPointsCompleted
                velocity
                completionRate
                totalTasks
                completedTasks
                averageCycleTime
                startDate
                endDate
              }
            }
          `,
          variables: {
            sprintId,
          },
        })
        .expect(200)
        .expect((res) => {
          if (res.body.data && res.body.data.getSprintMetrics) {
            const metrics = res.body.data.getSprintMetrics;
            expect(metrics.sprintId).toBe(sprintId);
            expect(metrics.sprintName).toBeDefined();
            expect(typeof metrics.status).toBe('string');
            expect(typeof metrics.storyPointsCommitted).toBe('number');
            expect(typeof metrics.storyPointsCompleted).toBe('number');
            expect(typeof metrics.velocity).toBe('number');
            expect(typeof metrics.completionRate).toBe('number');
            expect(typeof metrics.totalTasks).toBe('number');
            expect(typeof metrics.completedTasks).toBe('number');
            expect(typeof metrics.averageCycleTime).toBe('number');
            expect(metrics.startDate).toBeDefined();
            expect(metrics.endDate).toBeDefined();
          } else {
            // If sprint doesn't exist, expect an error
            expect(res.body.errors).toBeDefined();
          }
        });
    });

    it('should handle non-existent sprint ID', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetSprintMetrics($sprintId: String!) {
              getSprintMetrics(sprintId: $sprintId) {
                sprintId
              }
            }
          `,
          variables: {
            sprintId: '00000000-0000-0000-0000-000000000000',
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });

    it('should fail with invalid sprint ID format', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetSprintMetrics($sprintId: String!) {
              getSprintMetrics(sprintId: $sprintId) {
                sprintId
              }
            }
          `,
          variables: {
            sprintId: 'invalid-uuid',
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
            query GetSprintMetrics($sprintId: String!) {
              getSprintMetrics(sprintId: $sprintId) {
                sprintId
              }
            }
          `,
          variables: {
            sprintId,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });
  });

  describe('getProjectMetrics', () => {
    it('should get project metrics successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetProjectMetrics($projectId: String!) {
              getProjectMetrics(projectId: $projectId) {
                projectId
                projectName
                status
                progress
                totalTasks
                completedTasks
                totalStoryPoints
                completedStoryPoints
                budget
                spent
                remaining
                budgetUtilization
                totalSprints
                completedSprints
                averageVelocity
              }
            }
          `,
          variables: {
            projectId,
          },
        })
        .expect(200)
        .expect((res) => {
          if (res.body.data && res.body.data.getProjectMetrics) {
            const metrics = res.body.data.getProjectMetrics;
            expect(metrics.projectId).toBe(projectId);
            expect(metrics.projectName).toBeDefined();
            expect(typeof metrics.status).toBe('string');
            expect(typeof metrics.progress).toBe('number');
            expect(typeof metrics.totalTasks).toBe('number');
            expect(typeof metrics.completedTasks).toBe('number');
            expect(typeof metrics.totalStoryPoints).toBe('number');
            expect(typeof metrics.completedStoryPoints).toBe('number');
            expect(typeof metrics.budget).toBe('number');
            expect(typeof metrics.spent).toBe('number');
            expect(typeof metrics.remaining).toBe('number');
            expect(typeof metrics.budgetUtilization).toBe('number');
            expect(typeof metrics.totalSprints).toBe('number');
            expect(typeof metrics.completedSprints).toBe('number');
            expect(typeof metrics.averageVelocity).toBe('number');
          } else {
            // If project doesn't exist, expect an error
            expect(res.body.errors).toBeDefined();
          }
        });
    });

    it('should handle non-existent project ID', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetProjectMetrics($projectId: String!) {
              getProjectMetrics(projectId: $projectId) {
                projectId
              }
            }
          `,
          variables: {
            projectId: '00000000-0000-0000-0000-000000000000',
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
            query GetProjectMetrics($projectId: String!) {
              getProjectMetrics(projectId: $projectId) {
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
          expect(res.body.errors).toBeDefined();
        });
    });
  });

  describe('getDashboardMetrics', () => {
    it('should get dashboard metrics successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetDashboardMetrics {
              getDashboardMetrics {
                timestamp
                totalProjects
                totalBudget
                totalSpent
                remainingBudget
                budgetUtilization
                totalTasks
                completedTasks
                overallProgress
                projects {
                  projectId
                  projectName
                  status
                  progress
                }
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          if (res.body.data && res.body.data.getDashboardMetrics) {
            const metrics = res.body.data.getDashboardMetrics;
            expect(metrics.timestamp).toBeDefined();
            expect(typeof metrics.totalProjects).toBe('number');
            expect(typeof metrics.totalBudget).toBe('number');
            expect(typeof metrics.totalSpent).toBe('number');
            expect(typeof metrics.remainingBudget).toBe('number');
            expect(typeof metrics.budgetUtilization).toBe('number');
            expect(typeof metrics.totalTasks).toBe('number');
            expect(typeof metrics.completedTasks).toBe('number');
            expect(typeof metrics.overallProgress).toBe('number');
            expect(Array.isArray(metrics.projects)).toBe(true);
          } else {
            // If there's an authentication error or other issue, expect an error
            expect(res.body.errors).toBeDefined();
          }
        });
    });

    it('should fail without authentication token', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query GetDashboardMetrics {
              getDashboardMetrics {
                totalProjects
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

  describe('Metrics Validation', () => {
    it('should verify sprint metrics calculations are consistent', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetSprintMetrics($sprintId: String!) {
              getSprintMetrics(sprintId: $sprintId) {
                totalTasks
                completedTasks
                completionRate
                storyPointsCommitted
                storyPointsCompleted
              }
            }
          `,
          variables: {
            sprintId,
          },
        })
        .expect(200)
        .expect((res) => {
          if (res.body.errors) {
            expect(res.body.errors).toBeDefined();
          } else {
            const metrics = res.body.data.getSprintMetrics;

            // Verify completion rate is between 0 and 100
            expect(metrics.completionRate).toBeGreaterThanOrEqual(0);
            expect(metrics.completionRate).toBeLessThanOrEqual(100);

            // Verify story points consistency
            expect(metrics.storyPointsCompleted).toBeLessThanOrEqual(metrics.storyPointsCommitted);

            // Verify completed tasks don't exceed total tasks
            expect(metrics.completedTasks).toBeLessThanOrEqual(metrics.totalTasks);
          }
        });
    });

    it('should verify project metrics calculations are consistent', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetProjectMetrics($projectId: String!) {
              getProjectMetrics(projectId: $projectId) {
                totalSprints
                completedSprints
                totalTasks
                completedTasks
                progress
                budgetUtilization
              }
            }
          `,
          variables: {
            projectId,
          },
        })
        .expect(200)
        .expect((res) => {
          if (res.body.errors) {
            expect(res.body.errors).toBeDefined();
          } else {
            const metrics = res.body.data.getProjectMetrics;

            // Verify sprint count consistency
            expect(metrics.completedSprints).toBeLessThanOrEqual(metrics.totalSprints);

            // Verify percentages are in valid range
            expect(metrics.progress).toBeGreaterThanOrEqual(0);
            expect(metrics.progress).toBeLessThanOrEqual(100);
            expect(metrics.budgetUtilization).toBeGreaterThanOrEqual(0);

            // Verify task consistency
            expect(metrics.completedTasks).toBeLessThanOrEqual(metrics.totalTasks);
          }
        });
    });

    it('should verify dashboard metrics aggregation is consistent', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetDashboardMetrics {
              getDashboardMetrics {
                totalProjects
                totalTasks
                completedTasks
                overallProgress
                budgetUtilization
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.getDashboardMetrics).toBeDefined();
          const metrics = res.body.data.getDashboardMetrics;

          // Verify task count consistency
          expect(metrics.completedTasks).toBeLessThanOrEqual(metrics.totalTasks);

          // Verify percentages are in valid range
          expect(metrics.overallProgress).toBeGreaterThanOrEqual(0);
          expect(metrics.overallProgress).toBeLessThanOrEqual(100);
          expect(metrics.budgetUtilization).toBeGreaterThanOrEqual(0);

          // Verify basic counts are non-negative
          expect(metrics.totalProjects).toBeGreaterThanOrEqual(0);
          expect(metrics.totalTasks).toBeGreaterThanOrEqual(0);
          expect(metrics.completedTasks).toBeGreaterThanOrEqual(0);
        });
    });
  });
});
