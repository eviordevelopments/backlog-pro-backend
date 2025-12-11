import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../src/app.module';

describe('User Stories Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;
  let clientId: string;
  let projectId: string;
  let sprintId: string;
  let userStoryId: string;

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
    const email = `user-stories-test-${Date.now()}@example.com`;
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
            name: 'User Stories Test User',
          },
        },
      });

    authToken = signupRes.body.data.signup.token;
    userId = signupRes.body.data.signup.userId;

    // Create test client, project, and sprint for user story context
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
            name: 'User Stories Test Client',
            email: 'userstoriesclient@test.com',
            phone: '+1-555-0800',
            company: 'User Stories Test Corp',
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
            name: 'User Stories Test Project',
            description: 'Project for user stories testing',
            clientId,
            budget: 60000,
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
            name: 'User Stories Test Sprint',
            goal: 'Sprint for user stories testing',
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

  describe('createUserStory', () => {
    it('should create a user story successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation CreateUserStory($input: CreateUserStoryDto!) {
              createUserStory(input: $input) {
                id
                projectId
                sprintId
                title
                userType
                action
                benefit
                acceptanceCriteria {
                  id
                  description
                  completed
                }
                storyPoints
                priority
                status
                assignedTo
                definitionOfDone
                impactMetrics
                createdAt
                updatedAt
              }
            }
          `,
          variables: {
            input: {
              projectId,
              sprintId,
              title: 'User Authentication',
              userType: 'registered user',
              action: 'log into the system',
              benefit: 'I can access my personal dashboard and data',
              priority: 'high',
              acceptanceCriteria: [
                'User can enter email and password',
                'System validates credentials',
                'User is redirected to dashboard on success',
                'Error message shown for invalid credentials'
              ],
              storyPoints: 8,
              definitionOfDone: 'Code is reviewed and approved, Unit tests are written and passing, Integration tests are passing, Documentation is updated',
              impactMetrics: 'User login success rate > 95%, Login time < 2 seconds, User satisfaction score > 4.5/5',
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createUserStory).toBeDefined();
          expect(res.body.data.createUserStory.projectId).toBe(projectId);
          expect(res.body.data.createUserStory.sprintId).toBe(sprintId);
          expect(res.body.data.createUserStory.title).toBe('User Authentication');
          expect(res.body.data.createUserStory.userType).toBe('registered user');
          expect(res.body.data.createUserStory.action).toBe('log into the system');
          expect(res.body.data.createUserStory.benefit).toBe('I can access my personal dashboard and data');
          expect(res.body.data.createUserStory.priority).toBe('high');
          expect(res.body.data.createUserStory.storyPoints).toBe(8);
          expect(res.body.data.createUserStory.status).toBe('backlog');
          expect(Array.isArray(res.body.data.createUserStory.acceptanceCriteria)).toBe(true);
          expect(res.body.data.createUserStory.acceptanceCriteria).toHaveLength(4);
          expect(res.body.data.createUserStory.definitionOfDone).toBe('Code is reviewed and approved, Unit tests are written and passing, Integration tests are passing, Documentation is updated');
          expect(res.body.data.createUserStory.impactMetrics).toBe('User login success rate > 95%, Login time < 2 seconds, User satisfaction score > 4.5/5');
          userStoryId = res.body.data.createUserStory.id;
        });
    });

    it('should create a user story without sprint assignment', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation CreateUserStory($input: CreateUserStoryDto!) {
              createUserStory(input: $input) {
                id
                projectId
                sprintId
                title
                userType
                action
                benefit
                priority
                status
                storyPoints
              }
            }
          `,
          variables: {
            input: {
              projectId,
              title: 'Data Export Feature',
              userType: 'business user',
              action: 'export my data to CSV',
              benefit: 'I can analyze it in external tools',
              priority: 'medium',
              acceptanceCriteria: [
                'Export button is visible on data page',
                'CSV file is generated with all user data',
                'Download starts automatically'
              ],
              storyPoints: 5,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createUserStory).toBeDefined();
          expect(res.body.data.createUserStory.projectId).toBe(projectId);
          expect(res.body.data.createUserStory.sprintId).toBeNull();
          expect(res.body.data.createUserStory.title).toBe('Data Export Feature');
          expect(res.body.data.createUserStory.userType).toBe('business user');
          expect(res.body.data.createUserStory.action).toBe('export my data to CSV');
          expect(res.body.data.createUserStory.benefit).toBe('I can analyze it in external tools');
          expect(res.body.data.createUserStory.priority).toBe('medium');
          expect(res.body.data.createUserStory.storyPoints).toBe(5);
          expect(res.body.data.createUserStory.status).toBe('backlog');
        });
    });

    it('should create a low priority user story', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation CreateUserStory($input: CreateUserStoryDto!) {
              createUserStory(input: $input) {
                id
                title
                priority
                storyPoints
              }
            }
          `,
          variables: {
            input: {
              projectId,
              title: 'Dark Mode Theme',
              userType: 'end user',
              action: 'switch to dark mode',
              benefit: 'I can use the app comfortably in low light',
              priority: 'low',
              acceptanceCriteria: [
                'Toggle switch in settings',
                'All pages support dark theme',
                'User preference is saved'
              ],
              storyPoints: 3,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createUserStory).toBeDefined();
          expect(res.body.data.createUserStory.title).toBe('Dark Mode Theme');
          expect(res.body.data.createUserStory.priority).toBe('low');
          expect(res.body.data.createUserStory.storyPoints).toBe(3);
        });
    });

    it('should create user story even with non-existent project ID (no FK validation)', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation CreateUserStory($input: CreateUserStoryDto!) {
              createUserStory(input: $input) {
                id
                projectId
                title
              }
            }
          `,
          variables: {
            input: {
              projectId: '00000000-0000-0000-0000-000000000000',
              title: 'Story with Non-existent Project',
              userType: 'user',
              action: 'do something',
              benefit: 'get value',
              priority: 'medium',
              acceptanceCriteria: ['Test criteria'],
              storyPoints: 1,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createUserStory).toBeDefined();
          expect(res.body.data.createUserStory.projectId).toBe('00000000-0000-0000-0000-000000000000');
          expect(res.body.data.createUserStory.title).toBe('Story with Non-existent Project');
        });
    });

    it('should create user story with negative story points (no validation)', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation CreateUserStory($input: CreateUserStoryDto!) {
              createUserStory(input: $input) {
                id
                storyPoints
                title
              }
            }
          `,
          variables: {
            input: {
              projectId,
              title: 'Story with Negative Points',
              userType: 'user',
              action: 'do something',
              benefit: 'get value',
              priority: 'medium',
              acceptanceCriteria: ['Test criteria'],
              storyPoints: -5,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createUserStory).toBeDefined();
          expect(res.body.data.createUserStory.storyPoints).toBe(-5);
          expect(res.body.data.createUserStory.title).toBe('Story with Negative Points');
        });
    });

    it('should fail with missing required fields', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation CreateUserStory($input: CreateUserStoryDto!) {
              createUserStory(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              projectId,
              // Missing title, userType, action, benefit
              priority: 'medium',
              storyPoints: 1,
            },
          },
        })
        .expect(400);
    });

    it('should fail without authentication token', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation CreateUserStory($input: CreateUserStoryDto!) {
              createUserStory(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              projectId,
              title: 'Unauthorized Story',
              userType: 'user',
              action: 'do something',
              benefit: 'get value',
              priority: 'medium',
              acceptanceCriteria: ['Test criteria'],
              storyPoints: 1,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });
  });

  describe('getProjectBacklog', () => {
    it('should get project backlog with user stories', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetProjectBacklog($projectId: String!) {
              getProjectBacklog(projectId: $projectId) {
                id
                projectId
                sprintId
                title
                userType
                action
                benefit
                priority
                status
                storyPoints
                acceptanceCriteria {
                  id
                  description
                  completed
                }
                definitionOfDone
                impactMetrics
                assignedTo
                createdAt
                updatedAt
              }
            }
          `,
          variables: {
            projectId,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.getProjectBacklog).toBeDefined();
          expect(Array.isArray(res.body.data.getProjectBacklog)).toBe(true);
          expect(res.body.data.getProjectBacklog.length).toBeGreaterThan(0);
          
          // Verify all user stories belong to the project
          res.body.data.getProjectBacklog.forEach((story: any) => {
            expect(story.projectId).toBe(projectId);
            expect(story.id).toBeDefined();
            expect(story.title).toBeDefined();
            expect(story.userType).toBeDefined();
            expect(story.action).toBeDefined();
            expect(story.benefit).toBeDefined();
            expect(story.priority).toBeDefined();
            expect(story.status).toBeDefined();
            expect(typeof story.storyPoints).toBe('number');
            expect(Array.isArray(story.acceptanceCriteria)).toBe(true);
            // Verify acceptanceCriteria structure if present
            if (story.acceptanceCriteria && story.acceptanceCriteria.length > 0) {
              story.acceptanceCriteria.forEach((criteria: any) => {
                expect(criteria).toHaveProperty('id');
                expect(criteria).toHaveProperty('description');
                expect(criteria).toHaveProperty('completed');
              });
            }
          });
        });
    });

    it('should return empty array for project with no user stories', async () => {
      // Create a new project without user stories
      const emptyProjectRes = await request(app.getHttpServer())
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
              name: 'Empty Project',
              description: 'Project without user stories',
              clientId,
              budget: 10000,
            },
          },
        });

      const emptyProjectId = emptyProjectRes.body.data.createProject.id;

      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetProjectBacklog($projectId: String!) {
              getProjectBacklog(projectId: $projectId) {
                id
              }
            }
          `,
          variables: {
            projectId: emptyProjectId,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.getProjectBacklog).toBeDefined();
          expect(Array.isArray(res.body.data.getProjectBacklog)).toBe(true);
          expect(res.body.data.getProjectBacklog.length).toBe(0);
        });
    });

    it('should fail with invalid project ID format', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetProjectBacklog($projectId: String!) {
              getProjectBacklog(projectId: $projectId) {
                id
              }
            }
          `,
          variables: {
            projectId: 'invalid-uuid',
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
            query GetProjectBacklog($projectId: String!) {
              getProjectBacklog(projectId: $projectId) {
                id
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
});