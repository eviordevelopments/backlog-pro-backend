import { Injectable, Logger } from '@nestjs/common';

import { Sprint } from '../../domain/entities/sprint.entity';
import { SprintNotFoundException } from '../../domain/exceptions/sprint-not-found.exception';
import { SprintStatus } from '../../domain/value-objects/sprint-status.vo';
import { SprintRepository } from '../../repository/sprint.repository';

import { CompleteSprintCommand } from './complete-sprint.command';

@Injectable()
export class CompleteSprintCommandHandler {
  private readonly logger = new Logger(CompleteSprintCommandHandler.name);

  constructor(private readonly sprintRepository: SprintRepository) {}

  async handle(command: CompleteSprintCommand): Promise<Sprint> {
    this.logger.log(`Completing sprint: ${command.id}`);

    const sprint = await this.sprintRepository.getById(command.id);
    if (!sprint) {
      throw new SprintNotFoundException(command.id);
    }

    sprint.setStatus(SprintStatus.COMPLETED);
    sprint.setVelocity(sprint.getStoryPointsCompleted());

    const updated = await this.sprintRepository.update(command.id, sprint);
    this.logger.log(`Sprint completed successfully: ${command.id}`);
    return updated;
  }
}
