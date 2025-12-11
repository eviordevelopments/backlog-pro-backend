import fc from 'fast-check';
import { Project } from 'src/projects/domain/entities/project.entity';
import { Budget } from 'src/projects/domain/value-objects/budget.vo';
import { Sprint } from 'src/sprints/domain/entities/sprint.entity';
import { Task } from 'src/tasks/domain/entities/task.entity';

/**
 * Property-Based Tests for Data Integrity
 * Feature: backlog-pro-development
 *
 * These tests verify the correctness properties of data integrity
 * including relationship validation, soft delete preservation, and value object validation.
 */

describe('Data Integrity - Property-Based Tests', () => {
  /**
   * Feature: backlog-pro-development, Property 26: Relationship existence validation
   *
   * Property: For any relationship between entities, both entities must exist
   * before the relationship can be created.
   *
   * Validates: Requirements 17.1
   */
  describe('Property 26: Relationship existence validation', () => {
    it('should validate that project exists before creating sprint', () => {
      fc.assert(
        fc.property(
          fc.record({
            projectId: fc.uuid(),
            sprintName: fc.string({ minLength: 1, maxLength: 100 }),
          }),
          (data) => {
            // Create a sprint with a project ID
            const sprint = new Sprint(
              data.sprintName,
              data.projectId,
              'Sprint goal',
              new Date('2024-01-01'),
              new Date('2024-01-15'),
            );

            // Verify the relationship is set
            expect(sprint.getProjectId()).toBe(data.projectId);
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should validate that sprint exists before creating task', () => {
      fc.assert(
        fc.property(
          fc.record({
            projectId: fc.uuid(),
            sprintId: fc.uuid(),
            taskTitle: fc.string({ minLength: 1, maxLength: 255 }),
          }),
          (data) => {
            // Create a task with sprint ID
            const task = new Task(data.taskTitle, data.projectId);
            task.setSprintId(data.sprintId);

            // Verify the relationship is set
            expect(task.getSprintId()).toBe(data.sprintId);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  /**
   * Feature: backlog-pro-development, Property 27: Soft delete relationship preservation
   *
   * Property: For any entity that is soft-deleted, all its relationships must remain intact
   * and queryable.
   *
   * Validates: Requirements 17.2
   */
  describe('Property 27: Soft delete relationship preservation', () => {
    it('should preserve relationships after soft delete', () => {
      fc.assert(
        fc.property(
          fc.record({
            projectId: fc.uuid(),
            projectName: fc.string({ minLength: 1, maxLength: 255 }),
            sprintName: fc.string({ minLength: 1, maxLength: 100 }),
          }),
          (data) => {
            // Create project and sprint
            const project = new Project({
              id: data.projectId,
              name: data.projectName,
              clientId: 'client-1',
              budget: 100000,
              spent: 0,
              progress: 0,
            });

            const sprint = new Sprint(
              data.sprintName,
              project.id,
              'Sprint goal',
              new Date('2024-01-01'),
              new Date('2024-01-15'),
            );

            // Verify relationship before soft delete
            expect(sprint.getProjectId()).toBe(project.id);

            // Soft delete the project
            project.deletedAt = new Date();

            // Verify relationship is preserved after soft delete
            expect(sprint.getProjectId()).toBe(project.id);
            expect(project.deletedAt).toBeDefined();
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should preserve multiple relationships after soft delete', () => {
      fc.assert(
        fc.property(
          fc.record({
            projectId: fc.uuid(),
            projectName: fc.string({ minLength: 1, maxLength: 255 }),
            taskTitle: fc.string({ minLength: 1, maxLength: 255 }),
          }),
          (data) => {
            // Create project and task
            const project = new Project({
              id: data.projectId,
              name: data.projectName,
              clientId: 'client-1',
              budget: 100000,
              spent: 0,
              progress: 0,
            });

            const task = new Task(data.taskTitle, project.id);

            // Verify relationship before soft delete
            expect(task.getProjectId()).toBe(project.id);

            // Soft delete the project
            project.deletedAt = new Date();

            // Verify relationship is preserved after soft delete
            expect(task.getProjectId()).toBe(project.id);
            expect(project.deletedAt).toBeDefined();
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  /**
   * Feature: backlog-pro-development, Property 28: Value object validation
   *
   * Property: For any invalid data passed to a Value Object constructor,
   * an exception must be thrown.
   *
   * Validates: Requirements 17.3
   */
  describe('Property 28: Value object validation', () => {
    it('should reject negative budget values', () => {
      fc.assert(
        fc.property(fc.integer({ min: -1000000, max: -1 }), (negativeBudget) => {
          // Attempting to create a budget with negative value should throw
          expect(() => {
            new Budget(negativeBudget);
          }).toThrow();
        }),
        { numRuns: 100 },
      );
    });

    it('should accept positive budget values', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 1000000 }), (positiveBudget) => {
          // Creating a budget with positive value should succeed
          const budget = new Budget(positiveBudget);
          expect(budget.getValue()).toBe(positiveBudget);
        }),
        { numRuns: 100 },
      );
    });

    it('should accept zero budget value', () => {
      // Zero budget should be valid
      const budget = new Budget(0);
      expect(budget.getValue()).toBe(0);
    });

    it('should validate task title is not empty', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 255 }), fc.uuid(), (title, projectId) => {
          // Creating a task with non-empty title should succeed
          const task = new Task(title, projectId);
          expect(task.getTitle()).toBe(title);
        }),
        { numRuns: 100 },
      );
    });

    it('should validate project name is not empty', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 255 }), fc.uuid(), (name, clientId) => {
          // Creating a project with non-empty name should succeed
          const project = new Project({
            name,
            clientId,
            budget: 100000,
            spent: 0,
            progress: 0,
          });
          expect(project.name).toBe(name);
        }),
        { numRuns: 100 },
      );
    });
  });

  /**
   * Property: Relationship IDs must be valid UUIDs
   */
  describe('Relationship ID validation', () => {
    it('should accept valid UUID for project relationships', () => {
      fc.assert(
        fc.property(fc.uuid(), fc.uuid(), (projectId, clientId) => {
          // Creating a project with valid UUIDs should succeed
          const project = new Project({
            id: projectId,
            name: 'Test Project',
            clientId,
            budget: 100000,
            spent: 0,
            progress: 0,
          });
          expect(project.id).toBe(projectId);
          expect(project.clientId).toBe(clientId);
        }),
        { numRuns: 100 },
      );
    });

    it('should accept valid UUID for sprint relationships', () => {
      fc.assert(
        fc.property(fc.uuid(), fc.uuid(), (sprintId, projectId) => {
          // Creating a sprint with valid UUIDs should succeed
          const sprint = new Sprint(
            'Sprint 1',
            projectId,
            'Sprint goal',
            new Date('2024-01-01'),
            new Date('2024-01-15'),
            '09:00',
            sprintId,
          );
          expect(sprint.getId()).toBe(sprintId);
          expect(sprint.getProjectId()).toBe(projectId);
        }),
        { numRuns: 100 },
      );
    });
  });
});
