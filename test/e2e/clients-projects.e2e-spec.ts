import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../src/app.module';

describe('Clients & Projects Modules (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let clientId: string;
  let projectId: string;

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
    const email = `client-project-test-${Date.now()}@example.com`;
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
            name: 'Client Project Test',
          },
        },
      });

    authToken = signupRes.body.data.signup.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Clients', () => {
    describe('createClient', () => {
      it('should create a client successfully', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            query: `
              mutation CreateClient($input: CreateClientDto!) {
                createClient(input: $input) {
                  id
                  name
                  email
                  phone
                  company
                  industry
                  status
                }
              }
            `,
            variables: {
              input: {
                name: 'Test Client Corp',
                email: 'client@test.com',
                phone: '+1-555-0100',
                company: 'Test Corp',
                industry: 'Technology',
              },
            },
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createClient).toBeDefined();
            expect(res.body.data.createClient.name).toBe('Test Client Corp');
            expect(res.body.data.createClient.status).toBe('active');
            clientId = res.body.data.createClient.id;
          });
      });
    });

    describe('listClients', () => {
      it('should list all clients', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            query: `
              query ListClients {
                listClients {
                  id
                  name
                  email
                }
              }
            `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.listClients).toBeDefined();
            expect(Array.isArray(res.body.data.listClients)).toBe(true);
          });
      });
    });

    describe('getClient', () => {
      it('should get client by ID', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            query: `
              query GetClient($clientId: String!) {
                getClient(clientId: $clientId) {
                  id
                  name
                  email
                }
              }
            `,
            variables: {
              clientId,
            },
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.getClient).toBeDefined();
            expect(res.body.data.getClient.id).toBe(clientId);
          });
      });

      it('should fail with non-existent client ID', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            query: `
              query GetClient($clientId: String!) {
                getClient(clientId: $clientId) {
                  id
                }
              }
            `,
            variables: {
              clientId: '00000000-0000-0000-0000-000000000000',
            },
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].extensions.code).toBe('INTERNAL_SERVER_ERROR');
          });
      });
    });

    describe('updateClient', () => {
      it('should update client successfully', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            query: `
              mutation UpdateClient($clientId: String!, $input: UpdateClientDto!) {
                updateClient(clientId: $clientId, input: $input) {
                  id
                  name
                  ltv
                  cac
                  mrr
                }
              }
            `,
            variables: {
              clientId,
              input: {
                name: 'Updated Client Corp',
                ltv: 100000,
                cac: 10000,
                mrr: 5000,
              },
            },
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.updateClient).toBeDefined();
            expect(res.body.data.updateClient.name).toBe('Updated Client Corp');
            expect(res.body.data.updateClient.ltv).toBe(100000);
          });
      });
    });
  });

  describe('Projects', () => {
    describe('createProject', () => {
      it('should create a project successfully', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            query: `
              mutation CreateProject($input: CreateProjectDto!) {
                createProject(input: $input) {
                  id
                  name
                  description
                  clientId
                  status
                  budget
                }
              }
            `,
            variables: {
              input: {
                name: 'Test Project',
                description: 'E2E Test Project',
                clientId,
                budget: 50000,
              },
            },
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createProject).toBeDefined();
            expect(res.body.data.createProject.name).toBe('Test Project');
            expect(res.body.data.createProject.clientId).toBe(clientId);
            expect(res.body.data.createProject.status).toBe('planning');
            projectId = res.body.data.createProject.id;
          });
      });

      it('should fail with non-existent client ID', () => {
        return request(app.getHttpServer())
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
                name: 'Invalid Project',
                clientId: '00000000-0000-0000-0000-000000000000',
                budget: 10000,
              },
            },
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.errors).toBeDefined();
            expect(res.body.errors[0].extensions.code).toBe('BAD_REQUEST');
          });
      });
    });

    describe('listProjects', () => {
      it('should list all projects', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            query: `
              query ListProjects {
                listProjects {
                  id
                  name
                  clientId
                }
              }
            `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.listProjects).toBeDefined();
            expect(Array.isArray(res.body.data.listProjects)).toBe(true);
          });
      });

      it('should list projects filtered by client', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            query: `
              query ListProjects($clientId: String) {
                listProjects(clientId: $clientId) {
                  id
                  name
                  clientId
                }
              }
            `,
            variables: {
              clientId,
            },
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.listProjects).toBeDefined();
            expect(res.body.data.listProjects.every((p: any) => p.clientId === clientId)).toBe(true);
          });
      });
    });

    describe('getProject', () => {
      it('should get project by ID', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            query: `
              query GetProject($projectId: String!) {
                getProject(projectId: $projectId) {
                  id
                  name
                  clientId
                }
              }
            `,
            variables: {
              projectId,
            },
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.getProject).toBeDefined();
            expect(res.body.data.getProject.id).toBe(projectId);
          });
      });
    });

    describe('updateProject', () => {
      it('should update project successfully', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            query: `
              mutation UpdateProject($projectId: String!, $input: UpdateProjectDto!) {
                updateProject(projectId: $projectId, input: $input) {
                  id
                  name
                  status
                  budget
                  progress
                }
              }
            `,
            variables: {
              projectId,
              input: {
                name: 'Updated Test Project',
                status: 'active',
                budget: 75000,
                progress: 25,
              },
            },
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.updateProject).toBeDefined();
            expect(res.body.data.updateProject.name).toBe('Updated Test Project');
            expect(res.body.data.updateProject.status).toBe('active');
            expect(res.body.data.updateProject.progress).toBe(25);
          });
      });
    });
  });

  describe('Cascade Delete', () => {
    it('should soft delete project when client is deleted', async () => {
      // Delete the client
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation DeleteClient($clientId: String!) {
              deleteClient(clientId: $clientId)
            }
          `,
          variables: {
            clientId,
          },
        })
        .expect(200);

      // Try to get the project - should fail
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetProject($projectId: String!) {
              getProject(projectId: $projectId) {
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
          expect(res.body.errors[0].extensions.code).toBe('INTERNAL_SERVER_ERROR');
        });
    });
  });
});
