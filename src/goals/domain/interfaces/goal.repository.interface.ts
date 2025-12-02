import { Goal } from '@goals/domain/entities/goal.entity';

export interface IGoalRepository {
  create(goal: Goal): Promise<Goal>;
  update(id: string, goal: Partial<Goal>): Promise<Goal>;
  getById(id: string): Promise<Goal | null>;
  getByOwnerId(ownerId: string): Promise<Goal[]>;
  list(): Promise<Goal[]>;
  delete(id: string): Promise<void>;
}
