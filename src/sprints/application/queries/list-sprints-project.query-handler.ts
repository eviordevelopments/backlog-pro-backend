import { Injectable, Logger } from '@nestjs/common';
import { ListSprintsProjectQuery } from '@sprints/application/queries/list-sprints-project.query';
import { Sprint } from '@sprints/domain/entities/sprint.entity';
import { SprintRepository } from '@sprints/repository/sprint.repository';

@Injectable()
export class ListSprintsProjectQueryHandler {
  private readonly logger = new Logger(ListSprintsProjectQueryHandler.name);

  constructor(private readonly sprintRepository: SprintRepository) {}

  async handle(query: ListSprintsProjectQuery): Promise<Sprint[]> {
    this.logger.log(`Listing sprints for project: ${query.projectId}`);

    const sprints = await this.sprintRepository.listByProject(query.projectId);
    return sprints;
  }
}
