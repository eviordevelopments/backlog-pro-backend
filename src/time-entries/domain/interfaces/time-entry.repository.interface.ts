import type { TimeEntry } from '../entities/time-entry.entity';

export interface ITimeEntryRepository {
  create(timeEntry: TimeEntry): Promise<TimeEntry>;
  update(id: string, timeEntry: Partial<TimeEntry>): Promise<TimeEntry>;
  getById(id: string): Promise<TimeEntry | null>;
  listByTask(taskId: string): Promise<TimeEntry[]>;
  listByUser(userId: string): Promise<TimeEntry[]>;
  delete(id: string): Promise<void>;
}
