import { Injectable, Logger } from '@nestjs/common';

import { TimeEntryNotFoundException } from '../../domain/exceptions/time-entry-not-found.exception';
import { TaskRepository } from '../../../tasks/repository/task.repository';
import { TimeEntryRepository } from '../../repository/time-entry.repository';
import { DeleteTimeCommand } from './delete-time.command';

@Injectable()
export class DeleteTimeCommandHandler {
  private readonly logger = new Logger(DeleteTimeCommandHandler.name);

  constructor(
    private readonly timeEntryRepository: TimeEntryRepository,
    private readonly taskRepository: TaskRepository,
  ) {}

  async handle(command: DeleteTimeCommand): Promise<void> {
    this.logger.log(`Deleting time entry: ${command.id}`);

    const timeEntry = await this.timeEntryRepository.getById(command.id);
    if (!timeEntry) {
      throw new TimeEntryNotFoundException(command.id);
    }

    const hoursToRemove = timeEntry.getHours();

    // Recalculate task actual_hours
    const task = await this.taskRepository.getById(timeEntry.getTaskId());
    if (task) {
      const currentHours = task.getActualHours();
      task.setActualHours(Math.max(0, currentHours - hoursToRemove));
      await this.taskRepository.update(timeEntry.getTaskId(), task);
    }

    await this.timeEntryRepository.delete(command.id);
    this.logger.log(`Time entry deleted successfully: ${command.id}`);
  }
}
