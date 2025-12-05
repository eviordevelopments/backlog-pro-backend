import type { Feedback } from '../entities/feedback.entity';

export interface IFeedbackRepository {
  create(feedback: Feedback): Promise<Feedback>;
  update(id: string, feedback: Partial<Feedback>): Promise<Feedback>;
  getById(id: string): Promise<Feedback | null>;
  getByToUserId(toUserId: string): Promise<Feedback[]>;
  getBySprintId(sprintId: string): Promise<Feedback[]>;
  list(): Promise<Feedback[]>;
  delete(id: string): Promise<void>;
}
