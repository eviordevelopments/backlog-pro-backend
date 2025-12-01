import { Injectable, Logger } from '@nestjs/common';
import { CompleteSprintCommand } from '@sprints/application/commands/complete-sprint.command';
import { Sprint } from '@sprints/domain/entities/sprint.entity';
import { SprintRepository } from '@sprints/repository/sprint.repository';
import { SprintNotFoundException } from '@sprints/domain/exceptions';
import { SprintStatus } from '@sprints/domain/value-objects/sprint-status.vo';

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
