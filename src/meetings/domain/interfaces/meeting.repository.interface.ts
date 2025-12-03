import type { Meeting } from '../entities/meeting.entity';

export interface IMeetingRepository {
  create(meeting: Meeting): Promise<Meeting>;
  update(id: string, meeting: Partial<Meeting>): Promise<Meeting>;
  getById(id: string): Promise<Meeting | null>;
  getByProjectId(projectId: string): Promise<Meeting[]>;
  getBySprintId(sprintId: string): Promise<Meeting[]>;
  list(): Promise<Meeting[]>;
  delete(id: string): Promise<void>;
}
