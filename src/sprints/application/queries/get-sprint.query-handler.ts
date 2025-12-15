import { Injectable, Logger } from '@nestjs/common';

import { SprintNotFoundException } from '../../domain/exceptions/sprint-not-found.exception';
import { Sprint } from '../../domain/entities/sprint.entity';
import { SprintRepository } from '../../repository/sprint.repository';
import { GetSprintQuery } from './get-sprint.query';

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
