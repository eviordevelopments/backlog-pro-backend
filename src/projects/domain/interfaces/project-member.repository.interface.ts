import { ProjectMember } from '@projects/domain/entities/project-member.entity';

export interface IProjectMemberRepository {
  create(projectMember: ProjectMember): Promise<ProjectMember>;
  getByProjectAndUser(projectId: string, userId: string): Promise<ProjectMember | null>;
  listByProject(projectId: string): Promise<ProjectMember[]>;
  listByUser(userId: string): Promise<ProjectMember[]>;
  update(id: string, projectMember: Partial<ProjectMember>): Promise<ProjectMember>;
  delete(id: string): Promise<void>;
  existsByProjectAndUser(projectId: string, userId: string): Promise<boolean>;
}
