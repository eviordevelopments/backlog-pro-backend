import { Injectable, Logger } from '@nestjs/common';
import { GetProjectQuery } from '@projects/application/queries/get-project.query';
import { Project } from '@projects/domain/entities/project.entity';
import { ProjectNotFoundException } from '@projects/domain/exceptions';
import { ProjectRepository } from '@projects/repository/project.repository';

@Injectable()
export class GetProjectQueryHandler {
  private readonly logger = new Logger(GetProjectQueryHandler.name);

  constructor(private readonly projectRepository: ProjectRepository) {}

  async handle(query: GetProjectQuery): Promise<Project> {
    this.logger.log(`Obteniendo proyecto: ${query.projectId}`);

    const project = await this.projectRepository.getById(query.projectId);
    if (!project) {
      throw new ProjectNotFoundException(query.projectId);
    }

    return project;
  }
}
