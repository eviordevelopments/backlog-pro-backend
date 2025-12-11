import fc from 'fast-check';
import { Task } from 'src/tasks/domain/entities/task.entity';
import { TimeEntry } from 'src/time-entries/domain/entities/time-entry.entity';



describe('TimeEntry Entity - Property-Based Tests', () => {
  // Feature: backlog-pro-development, Property 14: Task hours consistency
  describe('Property 14: Task hours consistency', () => {
    it('should maintain task actual_hours equal to sum of all time entries', () => {
      fc.assert(
        fc.property(
          fc.record({
            taskId: fc.uuid(),
            projectId: fc.uuid(),
            timeEntries: fc.array(
              fc.record({
                userId: fc.uuid(),
                hours: fc.float({ min: Math.fround(0.1), max: Math.fround(24), noNaN: true }),
                date: fc.date(),
              }),
              { minLength: 1, maxLength: 20 },
            ),
          }),
          (data) => {
            // Create task
            const task = new Task('Test Task', data.projectId);

            // Calculate total hours from time entries
            const totalHours = data.timeEntries.reduce((sum, entry) => sum + entry.hours, 0);

            // Create time entries
            const entries = data.timeEntries.map(
              (entry) => new TimeEntry(data.taskId, entry.userId, entry.hours, entry.date),
            );

            // Update task with total hours
            task.setActualHours(totalHours);

            // Verify consistency
            expect(task.getActualHours()).toBeCloseTo(totalHours, 2);

            // Verify all entries have correct hours
            entries.forEach((entry, index) => {
              expect(entry.getHours()).toBeCloseTo(data.timeEntries[index].hours, 2);
            });

            // Verify sum of entries equals task hours
            const sumOfEntries = entries.reduce((sum, entry) => sum + entry.getHours(), 0);
            expect(sumOfEntries).toBeCloseTo(task.getActualHours(), 2);
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should maintain consistency when time entries are modified', () => {
      fc.assert(
        fc.property(
          fc.record({
            taskId: fc.uuid(),
            projectId: fc.uuid(),
            initialHours: fc.array(
              fc.float({ min: Math.fround(0.1), max: Math.fround(24), noNaN: true }),
              { minLength: 1, maxLength: 5 },
            ),
            modifiedHours: fc.array(
              fc.float({ min: Math.fround(0.1), max: Math.fround(24), noNaN: true }),
              { minLength: 1, maxLength: 5 },
            ),
          }),
          (data) => {
            const task = new Task('Test Task', data.projectId);

            // Set initial hours
            const initialTotal = data.initialHours.reduce((a, b) => a + b, 0);
            task.setActualHours(initialTotal);
            expect(task.getActualHours()).toBeCloseTo(initialTotal, 2);

            // Modify hours
            const modifiedTotal = data.modifiedHours.reduce((a, b) => a + b, 0);
            task.setActualHours(modifiedTotal);
            expect(task.getActualHours()).toBeCloseTo(modifiedTotal, 2);
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should handle zero hours correctly', () => {
      fc.assert(
        fc.property(
          fc.record({
            taskId: fc.uuid(),
            projectId: fc.uuid(),
          }),
          (data) => {
            const task = new Task('Test Task', data.projectId);
            const entry = new TimeEntry(data.taskId, fc.sample(fc.uuid(), 1)[0], 0, new Date());

            task.setActualHours(0);
            expect(task.getActualHours()).toBe(0);
            expect(entry.getHours()).toBe(0);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('TimeEntry Entity - Unit Tests', () => {
    it('should create a time entry with all required fields', () => {
      const taskId = 'task-123';
      const userId = 'user-456';
      const hours = 8;
      const date = new Date('2024-01-15');

      const entry = new TimeEntry(taskId, userId, hours, date);

      expect(entry.getTaskId()).toBe(taskId);
      expect(entry.getUserId()).toBe(userId);
      expect(entry.getHours()).toBe(hours);
      expect(entry.getDate()).toEqual(date);
      expect(entry.getId()).toBeDefined();
    });

    it('should create a time entry with description', () => {
      const taskId = 'task-123';
      const userId = 'user-456';
      const hours = 8;
      const date = new Date('2024-01-15');
      const description = 'Implemented authentication module';

      const entry = new TimeEntry(taskId, userId, hours, date, description);

      expect(entry.getDescription()).toBe(description);
    });

    it('should update hours', () => {
      const entry = new TimeEntry('task-123', 'user-456', 8, new Date('2024-01-15'));

      entry.setHours(10);
      expect(entry.getHours()).toBe(10);
    });

    it('should update description', () => {
      const entry = new TimeEntry('task-123', 'user-456', 8, new Date('2024-01-15'));

      entry.setDescription('Updated description');
      expect(entry.getDescription()).toBe('Updated description');
    });

    it('should update date', () => {
      const entry = new TimeEntry('task-123', 'user-456', 8, new Date('2024-01-15'));

      const newDate = new Date('2024-01-20');
      entry.setDate(newDate);
      expect(entry.getDate()).toEqual(newDate);
    });

    it('should support soft delete', () => {
      const entry = new TimeEntry('task-123', 'user-456', 8, new Date('2024-01-15'));

      expect(entry.getDeletedAt()).toBeNull();

      const now = new Date();
      entry.setDeletedAt(now);
      expect(entry.getDeletedAt()).toEqual(now);
    });

    it('should track creation and update timestamps', () => {
      const entry = new TimeEntry('task-123', 'user-456', 8, new Date('2024-01-15'));

      expect(entry.getCreatedAt()).toBeDefined();
      expect(entry.getUpdatedAt()).toBeDefined();

      const initialUpdatedAt = entry.getUpdatedAt();
      entry.setHours(10);

      expect(entry.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(initialUpdatedAt.getTime());
    });

    it('should handle fractional hours', () => {
      const entry = new TimeEntry('task-123', 'user-456', 2.5, new Date('2024-01-15'));

      expect(entry.getHours()).toBe(2.5);

      entry.setHours(3.75);
      expect(entry.getHours()).toBe(3.75);
    });

    it('should handle multiple time entries for same task', () => {
      const taskId = 'task-123';
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-01-16');
      const date3 = new Date('2024-01-17');

      const entry1 = new TimeEntry(taskId, 'user-1', 8, date1);
      const entry2 = new TimeEntry(taskId, 'user-2', 6, date2);
      const entry3 = new TimeEntry(taskId, 'user-1', 4, date3);

      expect(entry1.getTaskId()).toBe(taskId);
      expect(entry2.getTaskId()).toBe(taskId);
      expect(entry3.getTaskId()).toBe(taskId);

      const totalHours = entry1.getHours() + entry2.getHours() + entry3.getHours();
      expect(totalHours).toBe(18);
    });

    it('should maintain independence between time entries', () => {
      const entry1 = new TimeEntry('task-1', 'user-1', 8, new Date('2024-01-15'));
      const entry2 = new TimeEntry('task-2', 'user-2', 6, new Date('2024-01-16'));

      entry1.setHours(10);
      expect(entry1.getHours()).toBe(10);
      expect(entry2.getHours()).toBe(6);

      entry2.setHours(12);
      expect(entry1.getHours()).toBe(10);
      expect(entry2.getHours()).toBe(12);
    });
  });
});
