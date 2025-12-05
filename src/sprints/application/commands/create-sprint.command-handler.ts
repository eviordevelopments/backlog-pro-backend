import { Injectable, Logger } from '@nestjs/common';

import { Sprint } from '../../domain/entities/sprint.entity';
import { InvalidSprintDatesException } from '../../domain/exceptions/index';
import { SprintRepository } from '../../repository/sprint.repository';

import { CreateSprintCommand } from './create-sprint.command';

@Injectable()
export class CreateSprintCommandHandler {
  private readonly logger = new Logger(CreateSprintCommandHandler.name);

  constructor(private readonly sprintRepository: SprintRepository) {}

  async handle(command: CreateSprintCommand): Promise<Sprint> {
    this.logger.log(`Creating sprint: ${command.name}`);

    if (command.endDate <= command.startDate) {
      throw new InvalidSprintDatesException();
    }

    const sprint = new Sprint(
      command.name,
      command.projectId,
      command.goal,
      command.startDate,
      command.endDate,
      command.dailyStandupTime,
    );

    const created = await this.sprintRepository.create(sprint);
    this.logger.log(`Sprint created successfully: ${created.getId()}`);
    return created;
  }
}
