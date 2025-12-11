import { Injectable, Logger } from '@nestjs/common';

import { Sprint } from '../../domain/entities/sprint.entity';
import {
    InvalidSprintDatesException,
    SprintNotFoundException,
} from '../../domain/exceptions/index';
import { SprintRepository } from '../../repository/sprint.repository';

import { ExtendSprintCommand } from './extend-sprint.command';

@Injectable()
export class ExtendSprintCommandHandler {
  private readonly logger = new Logger(ExtendSprintCommandHandler.name);

  constructor(private readonly sprintRepository: SprintRepository) {}

  async handle(command: ExtendSprintCommand): Promise<Sprint> {
    this.logger.log(`Extending sprint: ${command.id}`);

    const sprint = await this.sprintRepository.getById(command.id);
    if (!sprint) {
      throw new SprintNotFoundException(command.id);
    }

    if (command.newEndDate <= sprint.getEndDate()) {
      throw new InvalidSprintDatesException();
    }

    sprint.setStatus(sprint.getStatus()); // Keep current status
    const updated = await this.sprintRepository.update(command.id, sprint);
    this.logger.log(`Sprint extended successfully: ${command.id}`);
    return updated;
  }
}
