import type { Project } from '../entities/project.entity';

export interface IProjectRepository {
  create(project: Project): Promise<Project>;
  getById(id: string): Promise<Project | null>;
  list(filters?: ProjectFilters): Promise<Project[]>;
  update(id: string, project: Partial<Project>): Promise<Project>;
  delete(id: string): Promise<void>;
}

export interface ProjectFilters {
  clientId?: string;
  status?: string;
  skip?: number;
  take?: number;
}
