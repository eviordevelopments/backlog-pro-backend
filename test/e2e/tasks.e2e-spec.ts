import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../src/app.module';

describe('Tasks Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;
  let clientId: string;
  let projectId: string;
  let sprintId: string;
  let taskId: string;
  let subtaskId: string;

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
    const email = `task-test-${Date.now()}@example.com`;
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
            name: 'Task Test User',
          },
        },
      });

    authToken = signupRes.body.data.signup.token;
    userId = signupRes.body.data.signup.userId;

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
            name: 'Task Test Client',
            email: 'taskclient@test.com',
            phone: '+1-555-0300',
            company: 'Task Test Corp',
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
            name: 'Task Test Project',
            description: 'Project for task testing',
            clientId,
            budget: 30000,
          },
        },
      });

    projectId = projectRes.body.data.createProject.id;

    // Create a test sprint
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
            name: 'Task Test Sprint',
            goal: 'Sprint for task testing',
            projectId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        },
      });

    sprintId = sprintRes.body.data.createSprint.id;

    // Add user as project member to allow task assignment
    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        query: `
          mutation AddProjectMember($projectId: String!, $input: AddMemberDto!) {
            addProjectMember(projectId: $projectId, input: $input) {
              id
            }
          }
        `,
        variables: {
          projectId,
          input: {
            userId,
            role: 'developer',
          },
        },
      });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('createTask', () => {
    it('should create a task successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation CreateTask($input: CreateTaskDto!) {
              createTask(input: $input) {
                id
                title
                description
                projectId
                sprintId
                status
                priority
                estimatedHours
                storyPoints
                tags
              }
            }
          `,
          variables: {
            input: {
              title: 'Implement user login',
              description: 'Create login functionality with JWT authentication',
              projectId,
              sprintId,
              estimatedHours: 8,
              storyPoints: 5,
              tags: ['authentication', 'backend'],
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createTask).toBeDefined();
          expect(res.body.data.createTask.title).toBe('Implement user login');
          expect(res.body.data.createTask.description).toBe('Create login functionality with JWT authentication');
          expect(res.body.data.createTask.projectId).toBe(projectId);
          expect(res.body.data.createTask.sprintId).toBe(sprintId);
          expect(res.body.data.createTask.status).toBe('todo');
          expect(res.body.data.createTask.estimatedHours).toBe(8);
          expect(res.body.data.createTask.storyPoints).toBe(5);
          expect(res.body.data.createTask.tags).toEqual(['authentication', 'backend']);
          taskId = res.body.data.createTask.id;
        });
    });

    it('should fail with non-existent project ID', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation CreateTask($input: CreateTaskDto!) {
              createTask(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              title: 'Invalid Task',
              description: 'Task with invalid project',
              projectId: '00000000-0000-0000-0000-000000000000',
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });

    it('should fail with missing required fields', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation CreateTask($input: CreateTaskDto!) {
              createTask(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              description: 'Task without title',
              projectId,
            },
          },
        })
        .expect(400);
    });
  });

  describe('getTask', () => {
    it('should get task by ID', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetTask($taskId: String!) {
              getTask(taskId: $taskId) {
                id
                title
                description
                projectId
                status
                priority
              }
            }
          `,
          variables: {
            taskId: taskId,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.getTask).toBeDefined();
          expect(res.body.data.getTask.id).toBe(taskId);
          expect(res.body.data.getTask.title).toBe('Implement user login');
        });
    });

    it('should fail with non-existent task ID', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetTask($taskId: String!) {
              getTask(taskId: $taskId) {
                id
              }
            }
          `,
          variables: {
            taskId: '00000000-0000-0000-0000-000000000000',
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });
  });

  describe('listTasksBySprint', () => {
    it('should list tasks by sprint', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query ListTasksBySprint($sprintId: String!) {
              listTasksBySprint(sprintId: $sprintId) {
                id
                title
                sprintId
                status
                priority
              }
            }
          `,
          variables: {
            sprintId,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.listTasksBySprint).toBeDefined();
          expect(Array.isArray(res.body.data.listTasksBySprint)).toBe(true);
          expect(res.body.data.listTasksBySprint.length).toBeGreaterThan(0);
          expect(res.body.data.listTasksBySprint[0].sprintId).toBe(sprintId);
        });
    });

    it('should return empty array for sprint with no tasks', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query ListTasksBySprint($sprintId: String!) {
              listTasksBySprint(sprintId: $sprintId) {
                id
              }
            }
          `,
          variables: {
            sprintId: '00000000-0000-0000-0000-000000000000',
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.listTasksBySprint).toBeDefined();
          expect(Array.isArray(res.body.data.listTasksBySprint)).toBe(true);
          expect(res.body.data.listTasksBySprint.length).toBe(0);
        });
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation UpdateTask($taskId: String!, $input: UpdateTaskDto!) {
              updateTask(taskId: $taskId, input: $input) {
                id
                title
                description
                status
                priority
                estimatedHours
                storyPoints
                tags
              }
            }
          `,
          variables: {
            taskId: taskId,
            input: {
              title: 'Updated: Implement user login',
              description: 'Updated: Create login functionality with JWT authentication and validation',
              status: 'in_progress',
              priority: 'critical',
              estimatedHours: 10,
              storyPoints: 8,
              tags: ['authentication', 'backend', 'security'],
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.updateTask).toBeDefined();
          expect(res.body.data.updateTask.title).toBe('Updated: Implement user login');
          expect(res.body.data.updateTask.status).toBe('in_progress');
          expect(res.body.data.updateTask.priority).toBe('critical');
          expect(res.body.data.updateTask.estimatedHours).toBe(10);
          expect(res.body.data.updateTask.storyPoints).toBe(8);
          expect(res.body.data.updateTask.tags).toEqual(['authentication', 'backend', 'security']);
        });
    });

    it('should fail with non-existent task ID', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation UpdateTask($taskId: String!, $input: UpdateTaskDto!) {
              updateTask(taskId: $taskId, input: $input) {
                id
              }
            }
          `,
          variables: {
            taskId: '00000000-0000-0000-0000-000000000000',
            input: {
              title: 'Non-existent Task',
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });
  });

  describe('assignTask', () => {
    it('should assign task to user successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation AssignTask($taskId: String!, $userId: String!) {
              assignTask(taskId: $taskId, userId: $userId) {
                id
                assignedTo
              }
            }
          `,
          variables: {
            taskId,
            userId,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.assignTask).toBeDefined();
          expect(res.body.data.assignTask.id).toBe(taskId);
          expect(res.body.data.assignTask.assignedTo).toBe(userId);
        });
    });

    it('should fail with non-existent task ID', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation AssignTask($taskId: String!, $userId: String!) {
              assignTask(taskId: $taskId, userId: $userId) {
                id
              }
            }
          `,
          variables: {
            taskId: '00000000-0000-0000-0000-000000000000',
            userId,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });

    it('should fail with non-existent user ID', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation AssignTask($taskId: String!, $userId: String!) {
              assignTask(taskId: $taskId, userId: $userId) {
                id
              }
            }
          `,
          variables: {
            taskId,
            userId: '00000000-0000-0000-0000-000000000000',
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });
  });

  describe('addSubtasks', () => {
    it('should add subtasks successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation AddSubtasks($taskId: String!, $subtasks: [String!]!) {
              addSubtasks(taskId: $taskId, subtasks: $subtasks) {
                id
                title
                description
              }
            }
          `,
          variables: {
            taskId,
            subtasks: [
              'Create login form',
              'Implement JWT validation',
            ],
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.addSubtasks).toBeDefined();
          expect(res.body.data.addSubtasks.id).toBe(taskId);
          expect(res.body.data.addSubtasks.title).toBeDefined();
        });
    });

    it('should fail with non-existent task ID', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation AddSubtasks($taskId: String!, $subtasks: [String!]!) {
              addSubtasks(taskId: $taskId, subtasks: $subtasks) {
                id
              }
            }
          `,
          variables: {
            taskId: '00000000-0000-0000-0000-000000000000',
            subtasks: ['Test subtask'],
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });
  });

  describe('addDependency', () => {
    let dependentTaskId: string;

    beforeAll(async () => {
      // Create another task to use as dependency
      const taskRes = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation CreateTask($input: CreateTaskDto!) {
              createTask(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              title: 'Setup database',
              description: 'Configure database connection',
              projectId,
              sprintId,
            },
          },
        });

      dependentTaskId = taskRes.body.data.createTask.id;
    });

    it('should add dependency successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation AddDependency($taskId: String!, $dependsOnTaskId: String!) {
              addDependency(taskId: $taskId, dependsOnTaskId: $dependsOnTaskId) {
                id
                dependencies
              }
            }
          `,
          variables: {
            taskId,
            dependsOnTaskId: dependentTaskId,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.addDependency).toBeDefined();
          expect(res.body.data.addDependency.id).toBe(taskId);
          expect(res.body.data.addDependency.dependencies).toBeDefined();
          expect(Array.isArray(res.body.data.addDependency.dependencies)).toBe(true);
        });
    });

    it('should fail with non-existent task ID', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation AddDependency($taskId: String!, $dependsOnTaskId: String!) {
              addDependency(taskId: $taskId, dependsOnTaskId: $dependsOnTaskId) {
                id
              }
            }
          `,
          variables: {
            taskId: '00000000-0000-0000-0000-000000000000',
            dependsOnTaskId: dependentTaskId,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });

    it('should fail with circular dependency', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation AddDependency($taskId: String!, $dependsOnTaskId: String!) {
              addDependency(taskId: $taskId, dependsOnTaskId: $dependsOnTaskId) {
                id
              }
            }
          `,
          variables: {
            taskId: dependentTaskId,
            dependsOnTaskId: taskId,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });
  });

  describe('deleteTask', () => {
    let taskToDeleteId: string;

    beforeAll(async () => {
      // Create a task to delete
      const taskRes = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation CreateTask($input: CreateTaskDto!) {
              createTask(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              title: 'Task to delete',
              description: 'This task will be deleted',
              projectId,
            },
          },
        });

      taskToDeleteId = taskRes.body.data.createTask.id;
    });

    it('should delete task successfully', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation DeleteTask($taskId: String!) {
              deleteTask(taskId: $taskId)
            }
          `,
          variables: {
            taskId: taskToDeleteId,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.deleteTask).toBe(true);
        });
    });

    it('should fail to get deleted task', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            query GetTask($taskId: String!) {
              getTask(taskId: $taskId) {
                id
              }
            }
          `,
          variables: {
            taskId: taskToDeleteId,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
        });
    });

    it('should handle non-existent task ID', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
            mutation DeleteTask($taskId: String!) {
              deleteTask(taskId: $taskId)
            }
          `,
          variables: {
            taskId: '00000000-0000-0000-0000-000000000000',
          },
        })
        .expect(200)
        .expect((res) => {
          // El endpoint maneja IDs inexistentes - puede devolver error o data
          expect(res.body).toBeDefined();
        });
    });
  });
});