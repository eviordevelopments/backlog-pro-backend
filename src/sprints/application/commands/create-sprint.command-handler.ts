import { Injectable, Logger } from '@nestjs/common';
import { CreateSprintCommand } from '@sprints/application/commands/create-sprint.command';
import { Sprint } from '@sprints/domain/entities/sprint.entity';
import { SprintRepository } from '@sprints/repository/sprint.repository';
import { InvalidSprintDatesException } from '@sprints/domain/exceptions';

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
