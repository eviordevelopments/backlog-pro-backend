import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from '../domain/entities/project.entity';
import {
  IProjectRepository,
  ProjectFilters,
} from '../domain/interfaces/project.repository.interface';

import { ProjectTypeOrmEntity } from './entities/project.typeorm-entity';
import { ProjectMapper } from './mappers/project.mapper';

@Injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(
    @InjectRepository(ProjectTypeOrmEntity)
    private readonly repository: Repository<ProjectTypeOrmEntity>,
  ) {}

  async create(project: Project): Promise<Project> {
    const entity = ProjectMapper.toPersistence(project);
    const saved = await this.repository.save(entity);
    return ProjectMapper.toDomain(saved);
  }

  async getById(id: string): Promise<Project | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });
    return entity ? ProjectMapper.toDomain(entity) : null;
  }

  async list(filters?: ProjectFilters): Promise<Project[]> {
    const query = this.repository.createQueryBuilder('project');

    if (filters?.clientId) {
      query.andWhere('project.clientId = :clientId', { clientId: filters.clientId });
    }

    if (filters?.status) {
      query.andWhere('project.status = :status', { status: filters.status });
    }

    query.andWhere('project.deletedAt IS NULL');
    query.orderBy('project.createdAt', 'DESC');

    if (filters?.skip) {
      query.skip(filters.skip);
    }

    if (filters?.take) {
      query.take(filters.take);
    }

    const entities = await query.getMany();
    return entities.map((entity) => ProjectMapper.toDomain(entity));
  }

  async update(id: string, project: Partial<Project>): Promise<Project> {
    await this.repository.update(id, project);
    const updated = await this.repository.findOne({
      where: { id },
    });
    if (!updated) {
      throw new Error(`Project with id ${id} not found`);
    }
    return ProjectMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
