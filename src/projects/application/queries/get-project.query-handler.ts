import { Injectable, Logger } from '@nestjs/common';

import { ProjectNotFoundException } from '../../domain/exceptions/project-not-found.exception';
import { Project } from '../../domain/entities/project.entity';
import { ProjectRepository } from '../../repository/project.repository';
import { GetProjectQuery } from './get-project.query';

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
