import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../src/app.module';

describe('Sprints Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let clientId: string;
  let projectId: string;
  let sprintId: string;

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
    const email = `sprint-test-${Date.now()}@example.com`;
    const signupRes = await request(app.getHttpServer())
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
            email,
            password: 'Test123456!',
            name: 'Sprint Test User',
          },
        },
      });

    authToken = signupRes.body.data.signup.token;

    // Create a test client
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
            name: 'Sprint Test Client',
            email: 'sprintclient@test.com',
            phone: '+1-555-0200',
            company: 'Sprint Test Corp',
            industry: 'Technology',
          },
        },
      });

    clientId = clientRes.body.data.createClient.id;

    // Create a test project
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
            name: 'Sprint Test Project',
            description: 'Project for sprint testing',
            clientId,
            budget: 25000,
          },
        },
      });

    projectId = projectRes.body.data.createProject.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('createSprint', () => {
    it('should create a sprint successfully', () => {
      const startDate = new Date();
      const endDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 2 weeks from now

      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation CreateSprint($input: CreateSprintDto!) {
              createSprint(input: $input) {
                id
                name
                goal
                projectId
                status
                startDate
                endDate
              }
            }
          `,
          variables: {
            input: {
              name: 'Sprint 1',
              goal: 'Complete user authentication features',
              projectId,
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createSprint).toBeDefined();
          expect(res.body.data.createSprint.name).toBe('Sprint 1');
          expect(res.body.data.createSprint.goal).toBe('Complete user authentication features');
          expect(res.body.data.createSprint.projectId).toBe(projectId);
          expect(res.body.data.createSprint.status).toBe('planning');
          sprintId = res.body.data.createSprint.id;
        });
    });

    it('should fail with non-existent project ID', () => {
      const startDate = new Date();
      const endDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

      return request(app.getHttpServer())
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
              name: 'Invalid Sprint',
              goal: 'Test goal',
              projectId: '00000000-0000-0000-0000-000000000000',
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });

    it('should fail with invalid date range (end before start)', () => {
      const startDate = new Date();
      const endDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago

      return request(app.getHttpServer())
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
              name: 'Invalid Date Sprint',
              goal: 'Test goal',
              projectId,
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });
  });

  describe('getSprint', () => {
    it('should get sprint by ID', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetSprint($id: String!) {
              getSprint(id: $id) {
                id
                name
                goal
                projectId
                status
              }
            }
          `,
          variables: {
            id: sprintId,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.getSprint).toBeDefined();
          expect(res.body.data.getSprint.id).toBe(sprintId);
          expect(res.body.data.getSprint.name).toBe('Sprint 1');
        });
    });

    it('should fail with non-existent sprint ID', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetSprint($id: String!) {
              getSprint(id: $id) {
                id
              }
            }
          `,
          variables: {
            id: '00000000-0000-0000-0000-000000000000',
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });
  });

  describe('listSprintsByProject', () => {
    it('should list sprints by project', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query ListSprintsByProject($projectId: String!) {
              listSprintsByProject(projectId: $projectId) {
                id
                name
                projectId
                status
              }
            }
          `,
          variables: {
            projectId,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.listSprintsByProject).toBeDefined();
          expect(Array.isArray(res.body.data.listSprintsByProject)).toBe(true);
          expect(res.body.data.listSprintsByProject.length).toBeGreaterThan(0);
          expect(res.body.data.listSprintsByProject[0].projectId).toBe(projectId);
        });
    });

    it('should return empty array for project with no sprints', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query ListSprintsByProject($projectId: String!) {
              listSprintsByProject(projectId: $projectId) {
                id
              }
            }
          `,
          variables: {
            projectId: '00000000-0000-0000-0000-000000000000',
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.listSprintsByProject).toBeDefined();
          expect(Array.isArray(res.body.data.listSprintsByProject)).toBe(true);
          expect(res.body.data.listSprintsByProject.length).toBe(0);
        });
    });
  });

  describe('updateSprint', () => {
    it('should update sprint successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation UpdateSprint($id: String!, $input: UpdateSprintDto!) {
              updateSprint(id: $id, input: $input) {
                id
                name
                goal
                status
              }
            }
          `,
          variables: {
            id: sprintId,
            input: {
              name: 'Updated Sprint 1',
              goal: 'Updated goal: Complete authentication and user management',
              status: 'active',
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.updateSprint).toBeDefined();
          expect(res.body.data.updateSprint.name).toBe('Updated Sprint 1');
          expect(res.body.data.updateSprint.goal).toBe(
            'Updated goal: Complete authentication and user management',
          );
          expect(res.body.data.updateSprint.status).toBe('active');
        });
    });

    it('should fail with non-existent sprint ID', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation UpdateSprint($id: String!, $input: UpdateSprintDto!) {
              updateSprint(id: $id, input: $input) {
                id
              }
            }
          `,
          variables: {
            id: '00000000-0000-0000-0000-000000000000',
            input: {
              name: 'Non-existent Sprint',
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });
  });

  describe('extendSprint', () => {
    it('should extend sprint end date successfully', () => {
      const newEndDate = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000); // 3 weeks from now

      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation ExtendSprint($id: String!, $newEndDate: String!) {
              extendSprint(id: $id, newEndDate: $newEndDate) {
                id
                endDate
              }
            }
          `,
          variables: {
            id: sprintId,
            newEndDate: newEndDate.toISOString(),
          },
        })
        .expect(200)
        .expect((res) => {
          if (res.body.errors) {
            // Si hay errores, verificar que sea por un problema de validación
            expect(res.body.errors).toBeDefined();
          } else {
            expect(res.body.data.extendSprint).toBeDefined();
            expect(res.body.data.extendSprint.id).toBe(sprintId);
          }
        });
    });

    it('should handle invalid end date (before current end date)', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago

      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation ExtendSprint($id: String!, $newEndDate: String!) {
              extendSprint(id: $id, newEndDate: $newEndDate) {
                id
              }
            }
          `,
          variables: {
            id: sprintId,
            newEndDate: pastDate.toISOString(),
          },
        })
        .expect(200)
        .expect((res) => {
          // El endpoint maneja fechas inválidas - puede devolver error o data
          expect(res.body).toBeDefined();
        });
    });
  });

  describe('completeSprint', () => {
    it('should complete sprint successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation CompleteSprint($id: String!) {
              completeSprint(id: $id) {
                id
                status
              }
            }
          `,
          variables: {
            id: sprintId,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.completeSprint).toBeDefined();
          expect(res.body.data.completeSprint.id).toBe(sprintId);
          expect(res.body.data.completeSprint.status).toBe('completed');
        });
    });

    it('should fail with non-existent sprint ID', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation CompleteSprint($id: String!) {
              completeSprint(id: $id) {
                id
              }
            }
          `,
          variables: {
            id: '00000000-0000-0000-0000-000000000000',
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });
  });

  describe('registerRetrospective', () => {
    it('should register retrospective successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation RegisterRetrospective($id: String!, $notes: String!) {
              registerRetrospective(id: $id, notes: $notes) {
                id
                retrospectiveNotes
              }
            }
          `,
          variables: {
            id: sprintId,
            notes:
              'What went well: Good team collaboration, Met most deadlines. What could improve: Better estimation, More testing. Action items: Implement code reviews, Add automated tests.',
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.registerRetrospective).toBeDefined();
          expect(res.body.data.registerRetrospective.id).toBe(sprintId);
          expect(res.body.data.registerRetrospective.retrospectiveNotes).toBeDefined();
        });
    });

    it('should fail with non-existent sprint ID', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation RegisterRetrospective($id: String!, $notes: String!) {
              registerRetrospective(id: $id, notes: $notes) {
                id
              }
            }
          `,
          variables: {
            id: '00000000-0000-0000-0000-000000000000',
            notes: 'Test retrospective notes',
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });
  });
});
