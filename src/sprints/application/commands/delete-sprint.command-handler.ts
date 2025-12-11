import { Injectable, Logger } from '@nestjs/common';

import { SprintNotFoundException } from '../../domain/exceptions/index';
import { SprintRepository } from '../../repository/sprint.repository';

import { DeleteSprintCommand } from './delete-sprint.command';

@Injectable()
export class DeleteSprintCommandHandler {
  private readonly logger = new Logger(DeleteSprintCommandHandler.name);

  constructor(private readonly sprintRepository: SprintRepository) {}

  async handle(command: DeleteSprintCommand): Promise<void> {
    this.logger.log(`Deleting sprint: ${command.id}`);

    const sprint = await this.sprintRepository.getById(command.id);
    if (!sprint) {
      throw new SprintNotFoundException(command.id);
    }

    // Soft delete
    await this.sprintRepository.delete(command.id);
    this.logger.log(`Sprint deleted successfully: ${command.id}`);
  }
}