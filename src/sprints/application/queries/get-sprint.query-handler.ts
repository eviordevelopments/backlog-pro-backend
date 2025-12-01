import { Injectable, Logger } from '@nestjs/common';
import { GetSprintQuery } from '@sprints/application/queries/get-sprint.query';
import { Sprint } from '@sprints/domain/entities/sprint.entity';
import { SprintRepository } from '@sprints/repository/sprint.repository';
import { SprintNotFoundException } from '@sprints/domain/exceptions';

@Injectable()
export class GetSprintQueryHandler {
  private readonly logger = new Logger(GetSprintQueryHandler.name);

  constructor(private readonly sprintRepository: SprintRepository) {}

  async handle(query: GetSprintQuery): Promise<Sprint> {
    this.logger.log(`Getting sprint: ${query.id}`);

    const sprint = await this.sprintRepository.getById(query.id);
    if (!sprint) {
      throw new SprintNotFoundException(query.id);
    }

    return sprint;
  }
}
