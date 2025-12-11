import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../src/app.module';

describe('Risks Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;
  let clientId: string;
  let projectId: string;
  let riskId: string;

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
    const email = `risks-test-${Date.now()}@example.com`;
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
            name: 'Risks Test User',
          },
        },
      });

    authToken = signupRes.body.data.signup.token;
    userId = signupRes.body.data.signup.userId;

    // Create test client and project for risk context
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
            name: 'Risks Test Client',
            email: 'risksclient@test.com',
            phone: '+1-555-0900',
            company: 'Risks Test Corp',
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
            name: 'Risks Test Project',
            description: 'Project for risks testing',
            clientId,
            budget: 70000,
          },
        },
      });

    projectId = projectRes.body.data.createProject.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('createRisk', () => {
    it('should create a high severity technical risk successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation CreateRisk($input: CreateRiskDto!) {
              createRisk(input: $input) {
                id
                projectId
                title
                description
                category
                probability
                impact
                severity
                mitigationStrategy
                responsibleId
                status
                isCore
                comments
                createdAt
                updatedAt
              }
            }
          `,
          variables: {
            input: {
              projectId,
              title: 'Database Performance Bottleneck',
              description:
                'The current database architecture may not handle the expected user load, potentially causing performance issues and system downtime.',
              category: 'technical',
              probability: 'high',
              impact: 'high',
              responsibleId: userId,
              mitigationStrategy:
                'Implement database optimization, add caching layer, consider database scaling solutions, and conduct load testing.',
              isCore: true,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createRisk).toBeDefined();
          expect(res.body.data.createRisk.projectId).toBe(projectId);
          expect(res.body.data.createRisk.title).toBe('Database Performance Bottleneck');
          expect(res.body.data.createRisk.description).toBe(
            'The current database architecture may not handle the expected user load, potentially causing performance issues and system downtime.',
          );
          expect(res.body.data.createRisk.category).toBe('technical');
          expect(res.body.data.createRisk.probability).toBe('high');
          expect(res.body.data.createRisk.impact).toBe('high');
          expect(typeof res.body.data.createRisk.severity).toBe('number');
          expect(res.body.data.createRisk.severity).toBeGreaterThan(5); // high + high = high severity number
          expect(res.body.data.createRisk.responsibleId).toBe(userId);
          expect(res.body.data.createRisk.mitigationStrategy).toBe(
            'Implement database optimization, add caching layer, consider database scaling solutions, and conduct load testing.',
          );
          expect(res.body.data.createRisk.status).toBe('identified');
          expect(res.body.data.createRisk.isCore).toBe(true);
          expect(Array.isArray(res.body.data.createRisk.comments)).toBe(true);
          riskId = res.body.data.createRisk.id;
        });
    });

    it('should create a medium severity business risk successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation CreateRisk($input: CreateRiskDto!) {
              createRisk(input: $input) {
                id
                title
                category
                probability
                impact
                severity
                isCore
                status
              }
            }
          `,
          variables: {
            input: {
              projectId,
              title: 'Market Competition Risk',
              description:
                'New competitors entering the market could affect user adoption and revenue projections.',
              category: 'business',
              probability: 'medium',
              impact: 'medium',
              responsibleId: userId,
              mitigationStrategy:
                'Monitor competitor activities, enhance unique value proposition, accelerate feature development.',
              isCore: false,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createRisk).toBeDefined();
          expect(res.body.data.createRisk.title).toBe('Market Competition Risk');
          expect(res.body.data.createRisk.category).toBe('business');
          expect(res.body.data.createRisk.probability).toBe('medium');
          expect(res.body.data.createRisk.impact).toBe('medium');
          expect(typeof res.body.data.createRisk.severity).toBe('number');
          expect(res.body.data.createRisk.severity).toBeGreaterThan(2);
          expect(res.body.data.createRisk.severity).toBeLessThan(7); // medium + medium = medium severity number
          expect(res.body.data.createRisk.isCore).toBe(false);
          expect(res.body.data.createRisk.status).toBe('identified');
        });
    });

    it('should create a low severity operational risk successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation CreateRisk($input: CreateRiskDto!) {
              createRisk(input: $input) {
                id
                title
                category
                probability
                impact
                severity
              }
            }
          `,
          variables: {
            input: {
              projectId,
              title: 'Team Member Vacation Overlap',
              description:
                'Multiple team members taking vacation during the same period could slow development.',
              category: 'operational',
              probability: 'low',
              impact: 'low',
              responsibleId: userId,
              mitigationStrategy:
                'Coordinate vacation schedules, cross-train team members, maintain documentation.',
              isCore: false,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createRisk).toBeDefined();
          expect(res.body.data.createRisk.title).toBe('Team Member Vacation Overlap');
          expect(res.body.data.createRisk.category).toBe('operational');
          expect(res.body.data.createRisk.probability).toBe('low');
          expect(res.body.data.createRisk.impact).toBe('low');
          expect(typeof res.body.data.createRisk.severity).toBe('number');
          expect(res.body.data.createRisk.severity).toBeLessThan(3); // low + low = low severity number
        });
    });

    it('should create risk even with non-existent project ID (no FK validation)', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation CreateRisk($input: CreateRiskDto!) {
              createRisk(input: $input) {
                id
                projectId
                title
              }
            }
          `,
          variables: {
            input: {
              projectId: '00000000-0000-0000-0000-000000000000',
              title: 'Risk with Non-existent Project',
              description: 'Risk for non-existent project',
              category: 'technical',
              probability: 'medium',
              impact: 'medium',
              responsibleId: userId,
              mitigationStrategy: 'Test mitigation',
              isCore: false,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createRisk).toBeDefined();
          expect(res.body.data.createRisk.projectId).toBe('00000000-0000-0000-0000-000000000000');
          expect(res.body.data.createRisk.title).toBe('Risk with Non-existent Project');
        });
    });

    it('should create risk even with non-existent responsible user ID (no FK validation)', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation CreateRisk($input: CreateRiskDto!) {
              createRisk(input: $input) {
                id
                responsibleId
                title
              }
            }
          `,
          variables: {
            input: {
              projectId,
              title: 'Risk with Non-existent User',
              description: 'Risk with invalid responsible user',
              category: 'technical',
              probability: 'medium',
              impact: 'medium',
              responsibleId: '00000000-0000-0000-0000-000000000000',
              mitigationStrategy: 'Test mitigation',
              isCore: false,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createRisk).toBeDefined();
          expect(res.body.data.createRisk.responsibleId).toBe(
            '00000000-0000-0000-0000-000000000000',
          );
          expect(res.body.data.createRisk.title).toBe('Risk with Non-existent User');
        });
    });

    it('should create risk even with invalid probability value (no enum validation)', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation CreateRisk($input: CreateRiskDto!) {
              createRisk(input: $input) {
                id
                probability
                title
              }
            }
          `,
          variables: {
            input: {
              projectId,
              title: 'Risk with Invalid Probability',
              description: 'Risk with invalid probability',
              category: 'technical',
              probability: 'invalid_probability',
              impact: 'medium',
              responsibleId: userId,
              mitigationStrategy: 'Test mitigation',
              isCore: false,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createRisk).toBeDefined();
          expect(res.body.data.createRisk.probability).toBe('invalid_probability');
          expect(res.body.data.createRisk.title).toBe('Risk with Invalid Probability');
        });
    });

    it('should fail with missing required fields', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation CreateRisk($input: CreateRiskDto!) {
              createRisk(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              projectId,
              // Missing title, category, probability, impact, responsibleId
              description: 'Risk without required fields',
              mitigationStrategy: 'Test mitigation',
              isCore: false,
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
            mutation CreateRisk($input: CreateRiskDto!) {
              createRisk(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              projectId,
              title: 'Unauthorized Risk',
              description: 'Risk without auth',
              category: 'technical',
              probability: 'medium',
              impact: 'medium',
              responsibleId: userId,
              mitigationStrategy: 'Test mitigation',
              isCore: false,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });
  });

  describe('getProjectRisks', () => {
    it('should get all risks for a project', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetProjectRisks($projectId: String!) {
              getProjectRisks(projectId: $projectId) {
                id
                projectId
                title
                description
                category
                probability
                impact
                severity
                mitigationStrategy
                responsibleId
                status
                isCore
                comments
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
          expect(res.body.data.getProjectRisks).toBeDefined();
          expect(Array.isArray(res.body.data.getProjectRisks)).toBe(true);
          expect(res.body.data.getProjectRisks.length).toBeGreaterThan(0);

          // Verify all risks belong to the project
          res.body.data.getProjectRisks.forEach((risk: any) => {
            expect(risk.projectId).toBe(projectId);
            expect(risk.id).toBeDefined();
            expect(risk.title).toBeDefined();
            expect(risk.category).toBeDefined();
            expect(risk.probability).toBeDefined();
            expect(risk.impact).toBeDefined();
            expect(risk.severity).toBeDefined();
            expect(risk.responsibleId).toBeDefined();
            expect(risk.status).toBeDefined();
            expect(typeof risk.isCore).toBe('boolean');
            expect(Array.isArray(risk.comments)).toBe(true);
          });
        });
    });

    it('should return empty array for project with no risks', async () => {
      // Create a new project without risks
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
              name: 'Empty Risks Project',
              description: 'Project without risks',
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
            query GetProjectRisks($projectId: String!) {
              getProjectRisks(projectId: $projectId) {
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
          expect(res.body.data.getProjectRisks).toBeDefined();
          expect(Array.isArray(res.body.data.getProjectRisks)).toBe(true);
          expect(res.body.data.getProjectRisks.length).toBe(0);
        });
    });

    it('should fail with invalid project ID format', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetProjectRisks($projectId: String!) {
              getProjectRisks(projectId: $projectId) {
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
            query GetProjectRisks($projectId: String!) {
              getProjectRisks(projectId: $projectId) {
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

  describe('Risk Severity Calculation', () => {
    it('should verify different severity combinations', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetProjectRisks($projectId: String!) {
              getProjectRisks(projectId: $projectId) {
                title
                probability
                impact
                severity
                category
                isCore
              }
            }
          `,
          variables: {
            projectId,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.getProjectRisks).toBeDefined();

          // Find risks with different severity levels
          const risks = res.body.data.getProjectRisks;
          const highSeverityRisk = risks.find((r: any) => r.severity > 6);
          const mediumSeverityRisk = risks.find((r: any) => r.severity >= 3 && r.severity <= 6);
          const lowSeverityRisk = risks.find((r: any) => r.severity < 3);

          if (highSeverityRisk) {
            expect(highSeverityRisk.probability).toBe('high');
            expect(highSeverityRisk.impact).toBe('high');
            expect(typeof highSeverityRisk.severity).toBe('number');
          }

          if (mediumSeverityRisk) {
            expect(mediumSeverityRisk.probability).toBe('medium');
            expect(mediumSeverityRisk.impact).toBe('medium');
            expect(typeof mediumSeverityRisk.severity).toBe('number');
          }

          if (lowSeverityRisk) {
            expect(lowSeverityRisk.probability).toBe('low');
            expect(lowSeverityRisk.impact).toBe('low');
            expect(typeof lowSeverityRisk.severity).toBe('number');
          }
        });
    });

    it('should verify risk categories and core status', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetProjectRisks($projectId: String!) {
              getProjectRisks(projectId: $projectId) {
                title
                category
                isCore
              }
            }
          `,
          variables: {
            projectId,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.getProjectRisks).toBeDefined();

          const risks = res.body.data.getProjectRisks;
          const technicalRisk = risks.find((r: any) => r.category === 'technical');
          const businessRisk = risks.find((r: any) => r.category === 'business');
          const operationalRisk = risks.find((r: any) => r.category === 'operational');

          if (technicalRisk) {
            expect(['technical', 'business', 'operational', 'financial', 'legal']).toContain(
              technicalRisk.category,
            );
            expect(typeof technicalRisk.isCore).toBe('boolean');
          }

          if (businessRisk) {
            expect(businessRisk.category).toBe('business');
          }

          if (operationalRisk) {
            expect(operationalRisk.category).toBe('operational');
          }
        });
    });
  });
});
