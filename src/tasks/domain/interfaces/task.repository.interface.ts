import { Task } from '@tasks/domain/entities/task.entity';

export interface ITaskRepository {
  create(task: Task): Promise<Task>;
  update(id: string, task: Partial<Task>): Promise<Task>;
  getById(id: string): Promise<Task | null>;
  listByProject(projectId: string): Promise<Task[]>;
  listBySprint(sprintId: string): Promise<Task[]>;
  delete(id: string): Promise<void>;
}
