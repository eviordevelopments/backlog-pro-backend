import { Injectable, Logger } from '@nestjs/common';

import { SprintNotFoundException } from '../../domain/exceptions/sprint-not-found.exception';
import { Sprint } from '../../domain/entities/sprint.entity';
import { SprintRepository } from '../../repository/sprint.repository';
import { RegisterRetrospectiveCommand } from './register-retrospective.command';

@Injectable()
export class RegisterRetrospectiveCommandHandler {
  private readonly logger = new Logger(RegisterRetrospectiveCommandHandler.name);

  constructor(private readonly sprintRepository: SprintRepository) {}

  async handle(command: RegisterRetrospectiveCommand): Promise<Sprint> {
    this.logger.log(`Registering retrospective for sprint: ${command.id}`);

    const sprint = await this.sprintRepository.getById(command.id);
    if (!sprint) {
      throw new SprintNotFoundException(command.id);
    }

    sprint.setRetrospectiveNotes(command.notes);
    sprint.setSprintRetrospectiveDate(new Date());

    const updated = await this.sprintRepository.update(command.id, sprint);
    this.logger.log(`Retrospective registered successfully: ${command.id}`);
    return updated;
  }
}
