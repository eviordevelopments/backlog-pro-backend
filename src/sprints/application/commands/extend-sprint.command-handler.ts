import { Injectable, Logger } from '@nestjs/common';
import { ExtendSprintCommand } from '@sprints/application/commands/extend-sprint.command';
import { Sprint } from '@sprints/domain/entities/sprint.entity';
import { SprintRepository } from '@sprints/repository/sprint.repository';
import { SprintNotFoundException, InvalidSprintDatesException } from '@sprints/domain/exceptions';

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
