import fc from 'fast-check';

import { InvalidBudgetException, InvalidProgressException } from '../exceptions/index';

import { Project } from './project.entity';

describe('Project Entity - Property-Based Tests', () => {
  // Feature: backlog-pro-development, Property 6: Project creation with default state
  describe('Property 6: Project creation with default state', () => {
    it('should create project with planning status for any valid project data', () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 255 }),
            clientId: fc.uuid(),
            budget: fc.float({ min: 0, max: 1000000 }),
            progress: fc.integer({ min: 0, max: 100 }),
          }),
          (projectData) => {
            const project = new Project({
              ...projectData,
              status: 'planning',
              spent: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            expect(project.status).toBe('planning');
            expect(project.name).toBe(projectData.name);
            expect(project.clientId).toBe(projectData.clientId);
            expect(project.budget).toBe(projectData.budget);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  // Feature: backlog-pro-development, Property 7: Budget validation
  describe('Property 7: Budget validation', () => {
    it('should reject negative budget updates and accept positive ones', () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 255 }),
            clientId: fc.uuid(),
            initialBudget: fc.float({ min: 0, max: 1000000 }),
            progress: fc.integer({ min: 0, max: 100 }),
          }),
          (data) => {
            const project = new Project({
              name: data.name,
              clientId: data.clientId,
              budget: data.initialBudget,
              progress: data.progress,
              spent: 0,
              status: 'planning',
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            // Positive budget should succeed
            const positiveBudget = fc.sample(fc.integer({ min: 1, max: 1000000 }), 1)[0];
            project.updateBudget(positiveBudget);
            expect(project.budget).toBe(positiveBudget);

            // Negative budget should throw
            expect(() => project.updateBudget(-100)).toThrow(InvalidBudgetException);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  // Feature: backlog-pro-development, Property 8: Soft delete preservation
  describe('Property 8: Soft delete preservation', () => {
    it('should preserve soft delete timestamp for any deleted project', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            name: fc.string({ minLength: 1, maxLength: 255 }),
            clientId: fc.uuid(),
            budget: fc.float({ min: 0, max: 1000000 }),
            progress: fc.integer({ min: 0, max: 100 }),
          }),
          (projectData) => {
            const now = new Date();
            const project = new Project({
              ...projectData,
              status: 'planning',
              spent: 0,
              createdAt: now,
              updatedAt: now,
              deletedAt: now,
            });

            expect(project.deletedAt).toBeDefined();
            expect(project.deletedAt).toEqual(now);
            expect(project.id).toBeDefined();
            expect(project.name).toBe(projectData.name);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  // Feature: backlog-pro-development, Property 9: Deleted project exclusion
  describe('Property 9: Deleted project exclusion', () => {
    it('should correctly identify deleted vs non-deleted projects', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.uuid(),
              name: fc.string({ minLength: 1, maxLength: 255 }),
              clientId: fc.uuid(),
              budget: fc.float({ min: 0, max: 1000000 }),
              progress: fc.integer({ min: 0, max: 100 }),
              isDeleted: fc.boolean(),
            }),
            { minLength: 1, maxLength: 20 },
          ),
          (projectsData) => {
            const now = new Date();
            const projects = projectsData.map((data) => {
              return new Project({
                id: data.id,
                name: data.name,
                clientId: data.clientId,
                budget: data.budget,
                progress: data.progress,
                spent: 0,
                status: 'planning',
                createdAt: now,
                updatedAt: now,
                deletedAt: data.isDeleted ? now : undefined,
              });
            });

            const activeProjects = projects.filter((p) => !p.deletedAt);
            const deletedProjects = projects.filter((p) => p.deletedAt);

            // Verify separation
            expect(activeProjects.length + deletedProjects.length).toBe(projects.length);

            // All active projects should have no deletedAt
            activeProjects.forEach((p) => {
              expect(p.deletedAt).toBeUndefined();
            });

            // All deleted projects should have deletedAt
            deletedProjects.forEach((p) => {
              expect(p.deletedAt).toBeDefined();
            });
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Project Entity - Unit Tests', () => {
    it('should create a project with default values', () => {
      const project = new Project({
        name: 'Test Project',
        clientId: 'client-123',
        budget: 10000,
        progress: 0,
        spent: 0,
        status: 'planning',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(project.name).toBe('Test Project');
      expect(project.status).toBe('planning');
      expect(project.progress).toBe(0);
    });

    it('should update budget successfully with positive value', () => {
      const project = new Project({
        name: 'Test Project',
        clientId: 'client-123',
        budget: 10000,
        progress: 0,
        spent: 0,
        status: 'planning',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      project.updateBudget(15000);
      expect(project.budget).toBe(15000);
    });

    it('should throw error when updating budget with negative value', () => {
      const project = new Project({
        name: 'Test Project',
        clientId: 'client-123',
        budget: 10000,
        progress: 0,
        spent: 0,
        status: 'planning',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(() => project.updateBudget(-1000)).toThrow(InvalidBudgetException);
    });

    it('should update progress successfully with valid value', () => {
      const project = new Project({
        name: 'Test Project',
        clientId: 'client-123',
        budget: 10000,
        progress: 0,
        spent: 0,
        status: 'planning',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      project.updateProgress(50);
      expect(project.progress).toBe(50);
    });

    it('should throw error when updating progress with invalid value', () => {
      const project = new Project({
        name: 'Test Project',
        clientId: 'client-123',
        budget: 10000,
        progress: 0,
        spent: 0,
        status: 'planning',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(() => project.updateProgress(150)).toThrow(InvalidProgressException);
      expect(() => project.updateProgress(-10)).toThrow(InvalidProgressException);
    });

    it('should add spent amount successfully', () => {
      const project = new Project({
        name: 'Test Project',
        clientId: 'client-123',
        budget: 10000,
        progress: 0,
        spent: 0,
        status: 'planning',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      project.addSpent(1000);
      expect(project.spent).toBe(1000);

      project.addSpent(500);
      expect(project.spent).toBe(1500);
    });

    it('should support soft delete with deletedAt timestamp', () => {
      const now = new Date();
      const project = new Project({
        name: 'Test Project',
        clientId: 'client-123',
        budget: 10000,
        progress: 0,
        spent: 0,
        status: 'planning',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: now,
      });

      expect(project.deletedAt).toEqual(now);
    });
  });
});
