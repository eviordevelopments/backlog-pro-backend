import { Project } from '@projects/domain/entities/project.entity';
import { Sprint } from '@sprints/domain/entities/sprint.entity';
import { Task } from '@tasks/domain/entities/task.entity';

/**
 * Tests para verificar que el soft delete preserva las relaciones entre entidades
 * Ensures that soft-deleted entities maintain their relationships
 */
describe('Soft Delete Relationship Preservation', () => {
  describe('Project soft delete', () => {
    it('should preserve project-sprint relationships after soft delete', () => {
      // Create a project
      const project = new Project({
        id: 'project-1',
        name: 'Test Project',
        clientId: 'client-1',
        budget: 100000,
        spent: 0,
        progress: 0,
      });

      // Create a sprint associated with the project
      const sprint = new Sprint(
        'Sprint 1',
        project.id,
        'Sprint goal',
        new Date('2024-01-01'),
        new Date('2024-01-15'),
      );

      // Verify the relationship exists
      expect(sprint.getProjectId()).toBe(project.id);

      // Soft delete the project
      project.deletedAt = new Date();

      // Verify the relationship is still intact after soft delete
      expect(sprint.getProjectId()).toBe(project.id);
      expect(project.deletedAt).toBeDefined();
    });

    it('should preserve project-task relationships after soft delete', () => {
      // Create a project
      const project = new Project({
        id: 'project-1',
        name: 'Test Project',
        clientId: 'client-1',
        budget: 100000,
        spent: 0,
        progress: 0,
      });

      // Create a task associated with the project
      const task = new Task('Test Task', project.id);

      // Verify the relationship exists
      expect(task.getProjectId()).toBe(project.id);

      // Soft delete the project
      project.deletedAt = new Date();

      // Verify the relationship is still intact after soft delete
      expect(task.getProjectId()).toBe(project.id);
      expect(project.deletedAt).toBeDefined();
    });
  });

  describe('Sprint soft delete', () => {
    it('should preserve sprint-task relationships after soft delete', () => {
      // Create a sprint
      const sprint = new Sprint(
        'Sprint 1',
        'project-1',
        'Sprint goal',
        new Date('2024-01-01'),
        new Date('2024-01-15'),
      );

      // Create a task associated with the sprint
      const task = new Task('Test Task', 'project-1');
      task.setSprintId(sprint.getId());

      // Verify the relationship exists
      expect(task.getSprintId()).toBe(sprint.getId());

      // Soft delete the sprint
      sprint.setDeletedAt(new Date());

      // Verify the relationship is still intact after soft delete
      expect(task.getSprintId()).toBe(sprint.getId());
      expect(sprint.getDeletedAt()).toBeDefined();
    });
  });

  describe('Task soft delete', () => {
    it('should preserve task-subtask relationships after soft delete', () => {
      // Create a parent task
      const parentTask = new Task('Parent Task', 'project-1');

      // Add a subtask
      parentTask.addSubtask('Subtask 1');

      // Verify the subtask exists
      expect(parentTask.getSubtasks().length).toBe(1);

      // Soft delete the parent task
      parentTask.setDeletedAt(new Date());

      // Verify the subtask relationship is still intact after soft delete
      expect(parentTask.getSubtasks().length).toBe(1);
      expect(parentTask.getDeletedAt()).toBeDefined();
    });

    it('should preserve task-dependency relationships after soft delete', () => {
      // Create two tasks
      const task1 = new Task('Task 1', 'project-1');
      const task2 = new Task('Task 2', 'project-1');

      // Create a dependency
      task2.addDependency(task1.getId());

      // Verify the dependency exists
      expect(task2.getDependencies().length).toBe(1);

      // Soft delete task1
      task1.setDeletedAt(new Date());

      // Verify the dependency is still intact after soft delete
      expect(task2.getDependencies().length).toBe(1);
      expect(task1.getDeletedAt()).toBeDefined();
    });
  });

  describe('Relationship integrity after multiple soft deletes', () => {
    it('should maintain relationship chain after cascading soft deletes', () => {
      // Create a hierarchy: Project -> Sprint -> Task
      const project = new Project({
        id: 'project-1',
        name: 'Test Project',
        clientId: 'client-1',
        budget: 100000,
        spent: 0,
        progress: 0,
      });

      const sprint = new Sprint(
        'Sprint 1',
        project.id,
        'Sprint goal',
        new Date('2024-01-01'),
        new Date('2024-01-15'),
      );

      const task = new Task('Test Task', project.id);
      task.setSprintId(sprint.getId());

      // Verify all relationships exist
      expect(sprint.getProjectId()).toBe(project.id);
      expect(task.getProjectId()).toBe(project.id);
      expect(task.getSprintId()).toBe(sprint.getId());

      // Soft delete in order: project -> sprint -> task
      project.deletedAt = new Date();
      sprint.setDeletedAt(new Date());
      task.setDeletedAt(new Date());

      // Verify all relationships are still intact
      expect(sprint.getProjectId()).toBe(project.id);
      expect(task.getProjectId()).toBe(project.id);
      expect(task.getSprintId()).toBe(sprint.getId());

      // Verify all entities are marked as deleted
      expect(project.deletedAt).toBeDefined();
      expect(sprint.getDeletedAt()).toBeDefined();
      expect(task.getDeletedAt()).toBeDefined();
    });
  });
});
