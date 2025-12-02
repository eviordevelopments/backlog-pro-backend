import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectMember } from '@projects/domain/entities/project-member.entity';
import { IProjectMemberRepository } from '@projects/domain/interfaces/project-member.repository.interface';
import { ProjectMemberTypeOrmEntity } from '@projects/repository/entities/project-member.typeorm-entity';
import { ProjectMemberMapper } from '@projects/repository/mappers/project-member.mapper';

@Injectable()
export class ProjectMemberRepository implements IProjectMemberRepository {
  constructor(
    @InjectRepository(ProjectMemberTypeOrmEntity)
    private readonly repository: Repository<ProjectMemberTypeOrmEntity>,
  ) {}

  async create(projectMember: ProjectMember): Promise<ProjectMember> {
    const entity = ProjectMemberMapper.toPersistence(projectMember);
    const saved = await this.repository.save(entity);
    return ProjectMemberMapper.toDomain(saved);
  }

  async getByProjectAndUser(projectId: string, userId: string): Promise<ProjectMember | null> {
    const entity = await this.repository.findOne({
      where: { projectId, userId },
    });
    return entity ? ProjectMemberMapper.toDomain(entity) : null;
  }

  async listByProject(projectId: string): Promise<ProjectMember[]> {
    const entities = await this.repository.find({
      where: { projectId },
    });
    return entities.map((entity) => ProjectMemberMapper.toDomain(entity));
  }

  async listByUser(userId: string): Promise<ProjectMember[]> {
    const entities = await this.repository.find({
      where: { userId },
    });
    return entities.map((entity) => ProjectMemberMapper.toDomain(entity));
  }

  async update(id: string, projectMember: Partial<ProjectMember>): Promise<ProjectMember> {
    await this.repository.update(id, projectMember);
    const updated = await this.repository.findOne({
      where: { id },
    });
    if (!updated) {
      throw new Error(`ProjectMember with id ${id} not found`);
    }
    return ProjectMemberMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async existsByProjectAndUser(projectId: string, userId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { projectId, userId },
    });
    return count > 0;
  }
}
