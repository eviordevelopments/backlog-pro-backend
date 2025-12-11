import fc from 'fast-check';
import { Task } from 'src/tasks/domain/entities/task.entity';
import { TaskPriority } from 'src/tasks/domain/value-objects/task-priority.vo';
import { TaskStatus } from 'src/tasks/domain/value-objects/task-status.vo';

describe('Task Entity - Property-Based Tests', () => {
  // Feature: backlog-pro-development, Property 12: Task creation with default state
  describe('Property 12: Task creation with default state', () => {
    it('should create task with todo status for any valid task data', () => {
      fc.assert(
        fc.property(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 255 }),
            projectId: fc.uuid(),
            description: fc.string({ maxLength: 1000 }),
          }),
          (taskData) => {
            const task = new Task(taskData.title, taskData.projectId, taskData.description);

            expect(task.getStatus().getValue()).toBe('todo');
            expect(task.getTitle()).toBe(taskData.title);
            expect(task.getProjectId()).toBe(taskData.projectId);
            expect(task.getDescription()).toBe(taskData.description);
            expect(task.getActualHours()).toBe(0);
            expect(task.getStoryPoints()).toBe(0);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  // Feature: backlog-pro-development, Property 13: Task assignment validation
  describe('Property 13: Task assignment validation', () => {
    it('should allow assignment to any user ID', () => {
      fc.assert(
        fc.property(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 255 }),
            projectId: fc.uuid(),
            assignedTo: fc.uuid(),
          }),
          (data) => {
            const task = new Task(data.title, data.projectId);

            task.setAssignedTo(data.assignedTo);
            expect(task.getAssignedTo()).toBe(data.assignedTo);
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should allow unassignment by setting to null', () => {
      fc.assert(
        fc.property(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 255 }),
            projectId: fc.uuid(),
            assignedTo: fc.uuid(),
          }),
          (data) => {
            const task = new Task(data.title, data.projectId);

            task.setAssignedTo(data.assignedTo);
            expect(task.getAssignedTo()).toBe(data.assignedTo);

            task.setAssignedTo(null);
            expect(task.getAssignedTo()).toBeNull();
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  // Feature: backlog-pro-development, Property 14: Task hours consistency
  describe('Property 14: Task hours consistency', () => {
    it('should maintain actual_hours equal to sum of time entries', () => {
      fc.assert(
        fc.property(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 255 }),
            projectId: fc.uuid(),
            timeEntries: fc.array(fc.integer({ min: 1, max: 24 }), { minLength: 1, maxLength: 20 }),
          }),
          (data) => {
            const task = new Task(data.title, data.projectId);

            // Simulate adding time entries
            const totalHours = data.timeEntries.reduce((sum, hours) => sum + hours, 0);
            task.setActualHours(totalHours);

            expect(task.getActualHours()).toBeCloseTo(totalHours, 2);
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should update actual_hours when modified', () => {
      fc.assert(
        fc.property(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 255 }),
            projectId: fc.uuid(),
            hours: fc.array(fc.integer({ min: 1, max: 24 }), { minLength: 1, maxLength: 5 }),
          }),
          (data) => {
            const task = new Task(data.title, data.projectId);

            data.hours.forEach((hours) => {
              task.setActualHours(hours);
              expect(task.getActualHours()).toBeCloseTo(hours, 2);
            });

            // Final value should be the last one set
            const lastHours = data.hours[data.hours.length - 1];
            expect(task.getActualHours()).toBeCloseTo(lastHours, 2);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  // Feature: backlog-pro-development, Property 15: Task dependency cycle detection
  describe('Property 15: Task dependency cycle detection', () => {
    it('should allow adding dependencies without cycles', () => {
      fc.assert(
        fc.property(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 255 }),
            projectId: fc.uuid(),
            dependencies: fc.array(fc.uuid(), { minLength: 1, maxLength: 10 }),
          }),
          (data) => {
            const task = new Task(data.title, data.projectId);

            // Add dependencies
            data.dependencies.forEach((depId) => {
              task.addDependency(depId);
            });

            // All dependencies should be present
            expect(task.getDependencies().length).toBe(data.dependencies.length);
            data.dependencies.forEach((depId) => {
              expect(task.getDependencies()).toContain(depId);
            });
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should prevent duplicate dependencies', () => {
      fc.assert(
        fc.property(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 255 }),
            projectId: fc.uuid(),
            dependencyId: fc.uuid(),
          }),
          (data) => {
            const task = new Task(data.title, data.projectId);

            // Add same dependency multiple times
            task.addDependency(data.dependencyId);
            task.addDependency(data.dependencyId);
            task.addDependency(data.dependencyId);

            // Should only have one instance
            expect(task.getDependencies().length).toBe(1);
            expect(task.getDependencies()[0]).toBe(data.dependencyId);
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should allow removing dependencies', () => {
      fc.assert(
        fc.property(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 255 }),
            projectId: fc.uuid(),
            dependencies: fc.array(fc.uuid(), { minLength: 2, maxLength: 10 }),
          }),
          (data) => {
            const task = new Task(data.title, data.projectId);

            // Add all dependencies
            data.dependencies.forEach((depId) => {
              task.addDependency(depId);
            });

            // Remove first dependency
            const firstDep = data.dependencies[0];
            task.removeDependency(firstDep);

            expect(task.getDependencies()).not.toContain(firstDep);
            expect(task.getDependencies().length).toBe(data.dependencies.length - 1);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Task Entity - Unit Tests', () => {
    it('should create a task with todo status by default', () => {
      const task = new Task('Implement feature', 'project-123');

      expect(task.getTitle()).toBe('Implement feature');
      expect(task.getProjectId()).toBe('project-123');
      expect(task.getStatus().getValue()).toBe('todo');
      expect(task.getPriority().getValue()).toBe('medium');
      expect(task.getActualHours()).toBe(0);
      expect(task.getStoryPoints()).toBe(0);
    });

    it('should update task title', () => {
      const task = new Task('Implement feature', 'project-123');

      task.setTitle('Implement feature - Updated');
      expect(task.getTitle()).toBe('Implement feature - Updated');
    });

    it('should update task status', () => {
      const task = new Task('Implement feature', 'project-123');

      task.setStatus(TaskStatus.IN_PROGRESS);
      expect(task.getStatus().getValue()).toBe('in_progress');

      task.setStatus(TaskStatus.DONE);
      expect(task.getStatus().getValue()).toBe('done');
    });

    it('should update task priority', () => {
      const task = new Task('Implement feature', 'project-123');

      task.setPriority(TaskPriority.HIGH);
      expect(task.getPriority().getValue()).toBe('high');

      task.setPriority(TaskPriority.CRITICAL);
      expect(task.getPriority().getValue()).toBe('critical');
    });

    it('should assign and unassign task', () => {
      const task = new Task('Implement feature', 'project-123');

      expect(task.getAssignedTo()).toBeNull();

      task.setAssignedTo('user-123');
      expect(task.getAssignedTo()).toBe('user-123');

      task.setAssignedTo(null);
      expect(task.getAssignedTo()).toBeNull();
    });

    it('should set story points', () => {
      const task = new Task('Implement feature', 'project-123');

      task.setStoryPoints(8);
      expect(task.getStoryPoints()).toBe(8);
    });

    it('should set estimated and actual hours', () => {
      const task = new Task('Implement feature', 'project-123');

      task.setEstimatedHours(16);
      task.setActualHours(12);

      expect(task.getEstimatedHours()).toBe(16);
      expect(task.getActualHours()).toBe(12);
    });

    it('should manage tags', () => {
      const task = new Task('Implement feature', 'project-123');

      task.addTag('backend');
      task.addTag('api');

      expect(task.getTags()).toContain('backend');
      expect(task.getTags()).toContain('api');
      expect(task.getTags().length).toBe(2);

      task.removeTag('backend');
      expect(task.getTags()).not.toContain('backend');
      expect(task.getTags().length).toBe(1);
    });

    it('should prevent duplicate tags', () => {
      const task = new Task('Implement feature', 'project-123');

      task.addTag('backend');
      task.addTag('backend');
      task.addTag('backend');

      expect(task.getTags().length).toBe(1);
    });

    it('should manage dependencies', () => {
      const task = new Task('Implement feature', 'project-123');

      task.addDependency('task-1');
      task.addDependency('task-2');

      expect(task.getDependencies()).toContain('task-1');
      expect(task.getDependencies()).toContain('task-2');
      expect(task.getDependencies().length).toBe(2);

      task.removeDependency('task-1');
      expect(task.getDependencies()).not.toContain('task-1');
      expect(task.getDependencies().length).toBe(1);
    });

    it('should manage subtasks', () => {
      const task = new Task('Implement feature', 'project-123');

      const subtask1Id = 'sub-1';
      const subtask2Id = 'sub-2';

      task.addSubtask(subtask1Id);
      task.addSubtask(subtask2Id);

      expect(task.getSubtasks().length).toBe(2);
      expect(task.getSubtasks()).toContain(subtask1Id);
      expect(task.getSubtasks()).toContain(subtask2Id);
    });

    it('should support soft delete', () => {
      const task = new Task('Implement feature', 'project-123');
      const now = new Date();

      expect(task.getDeletedAt()).toBeNull();

      task.setDeletedAt(now);
      expect(task.getDeletedAt()).toEqual(now);
    });

    it('should track creation and update timestamps', () => {
      const task = new Task('Implement feature', 'project-123');

      expect(task.getCreatedAt()).toBeDefined();
      expect(task.getUpdatedAt()).toBeDefined();

      const initialUpdatedAt = task.getUpdatedAt();
      task.setTitle('Updated title');

      expect(task.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(initialUpdatedAt.getTime());
    });
  });
});
