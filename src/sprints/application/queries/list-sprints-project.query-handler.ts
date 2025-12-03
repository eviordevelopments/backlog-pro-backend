import { Injectable, Logger } from '@nestjs/common';

import { Sprint } from '../../domain/entities/sprint.entity';
import { SprintRepository } from '../../repository/sprint.repository';

import { ListSprintsProjectQuery } from './list-sprints-project.query';

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
