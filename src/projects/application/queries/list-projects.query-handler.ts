import { Injectable, Logger } from '@nestjs/common';
import { ListProjectsQuery } from '@projects/application/queries/list-projects.query';
import { Project } from '@projects/domain/entities/project.entity';
import { ProjectRepository } from '@projects/repository/project.repository';

@Injectable()
export class ListProjectsQueryHandler {
  private readonly logger = new Logger(ListProjectsQueryHandler.name);

  constructor(private readonly projectRepository: ProjectRepository) {}

  async handle(query: ListProjectsQuery): Promise<Project[]> {
    this.logger.log('Listando proyectos');

    const projects = await this.projectRepository.list({
      clientId: query.clientId,
      status: query.status,
      skip: query.skip,
      take: query.take,
    });

    return projects;
  }
}
