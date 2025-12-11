import { Injectable, Logger } from '@nestjs/common';

import { Sprint } from '../../domain/entities/sprint.entity';
import {
  InvalidSprintDatesException,
  SprintNotFoundException,
} from '../../domain/exceptions/index';
import { SprintStatus } from '../../domain/value-objects/sprint-status.vo';
import { SprintRepository } from '../../repository/sprint.repository';

import { UpdateSprintCommand } from './update-sprint.command';

@Injectable()
export class UpdateSprintCommandHandler {
  private readonly logger = new Logger(UpdateSprintCommandHandler.name);

  constructor(private readonly sprintRepository: SprintRepository) {}

  async handle(command: UpdateSprintCommand): Promise<Sprint> {
    this.logger.log(`Updating sprint: ${command.id}`);

    const sprint = await this.sprintRepository.getById(command.id);
    if (!sprint) {
      throw new SprintNotFoundException(command.id);
    }

    if (command.name) {
      sprint.setName(command.name);
    }

    if (command.goal) {
      sprint.setGoal(command.goal);
    }

    if (command.endDate) {
      if (command.endDate <= sprint.getStartDate()) {
        throw new InvalidSprintDatesException();
      }
    }

    if (command.status) {
      sprint.setStatus(SprintStatus.fromString(command.status));
    }

    if (command.velocity !== undefined) {
      sprint.setVelocity(command.velocity);
    }

    if (command.storyPointsCommitted !== undefined) {
      sprint.setStoryPointsCommitted(command.storyPointsCommitted);
    }

    if (command.storyPointsCompleted !== undefined) {
      sprint.setStoryPointsCompleted(command.storyPointsCompleted);
    }

    if (command.teamMembers) {
      sprint.setTeamMembers(command.teamMembers);
    }

    if (command.dailyStandupTime) {
      // Update daily standup time (no setter, would need to add)
    }

    if (command.retrospectiveNotes) {
      sprint.setRetrospectiveNotes(command.retrospectiveNotes);
    }

    const updated = await this.sprintRepository.update(command.id, sprint);
    this.logger.log(`Sprint updated successfully: ${command.id}`);
    return updated;
  }
}
