import type { Risk } from '../entities/risk.entity';

export interface IRiskRepository {
  create(risk: Risk): Promise<Risk>;
  update(id: string, risk: Partial<Risk>): Promise<Risk>;
  getById(id: string): Promise<Risk | null>;
  getByProjectId(projectId: string): Promise<Risk[]>;
  list(): Promise<Risk[]>;
  delete(id: string): Promise<void>;
}
