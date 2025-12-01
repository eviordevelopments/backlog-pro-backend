import { Sprint } from '@sprints/domain/entities/sprint.entity';

export interface ISprintRepository {
  create(sprint: Sprint): Promise<Sprint>;
  update(id: string, sprint: Partial<Sprint>): Promise<Sprint>;
  getById(id: string): Promise<Sprint | null>;
  listByProject(projectId: string): Promise<Sprint[]>;
  delete(id: string): Promise<void>;
}
