import { Project } from '@projects/domain/entities/project.entity';
import { ProjectTypeOrmEntity } from '@projects/repository/entities/project.typeorm-entity';

export class ProjectMapper {
  static toDomain(raw: ProjectTypeOrmEntity): Project {
    return new Project({
      id: raw.id,
      name: raw.name,
      description: raw.description,
      clientId: raw.clientId,
      status: raw.status,
      methodology: raw.methodology,
      budget: Number(raw.budget),
      spent: Number(raw.spent),
      startDate: raw.startDate,
      endDate: raw.endDate,
      progress: raw.progress,
      devopsStage: raw.devopsStage,
      priority: raw.priority,
      tags: raw.tags,
      repositoryUrl: raw.repositoryUrl,
      deploymentUrl: raw.deploymentUrl,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  static toPersistence(project: Project): ProjectTypeOrmEntity {
    const entity = new ProjectTypeOrmEntity();
    entity.id = project.id;
    entity.name = project.name;
    entity.description = project.description;
    entity.clientId = project.clientId;
    entity.status = project.status;
    entity.methodology = project.methodology;
    entity.budget = project.budget;
    entity.spent = project.spent;
    entity.startDate = project.startDate;
    entity.endDate = project.endDate;
    entity.progress = project.progress;
    entity.devopsStage = project.devopsStage;
    entity.priority = project.priority;
    entity.tags = project.tags;
    entity.repositoryUrl = project.repositoryUrl;
    entity.deploymentUrl = project.deploymentUrl;
    entity.createdAt = project.createdAt;
    entity.updatedAt = project.updatedAt;
    entity.deletedAt = project.deletedAt;
    return entity;
  }
}
