import { Injectable, Logger } from '@nestjs/common';
import { ModifyTimeCommand } from '@time-entries/application/commands/modify-time.command';
import { TimeEntry } from '@time-entries/domain/entities/time-entry.entity';
import { TimeEntryRepository } from '@time-entries/repository/time-entry.repository';
import { TaskRepository } from '@tasks/repository/task.repository';
import { TimeEntryNotFoundException } from '@time-entries/domain/exceptions';

@Injectable()
export class ModifyTimeCommandHandler {
  private readonly logger = new Logger(ModifyTimeCommandHandler.name);

  constructor(
    private readonly timeEntryRepository: TimeEntryRepository,
    private readonly taskRepository: TaskRepository,
  ) {}

  async handle(command: ModifyTimeCommand): Promise<TimeEntry> {
    this.logger.log(`Modifying time entry: ${command.id}`);

    const timeEntry = await this.timeEntryRepository.getById(command.id);
    if (!timeEntry) {
      throw new TimeEntryNotFoundException(command.id);
    }

    const oldHours = timeEntry.getHours();
    let newHours = oldHours;

    if (command.hours !== undefined) {
      timeEntry.setHours(command.hours);
      newHours = command.hours;
    }

    if (command.description !== undefined) {
      timeEntry.setDescription(command.description);
    }

    if (command.date !== undefined) {
      timeEntry.setDate(command.date);
    }

    const updated = await this.timeEntryRepository.update(command.id, timeEntry);

    // Recalculate task actual_hours
    const task = await this.taskRepository.getById(timeEntry.getTaskId());
    if (task) {
      const currentHours = task.getActualHours();
      const hoursDifference = newHours - oldHours;
      task.setActualHours(currentHours + hoursDifference);
      await this.taskRepository.update(timeEntry.getTaskId(), task);
    }

    this.logger.log(`Time entry modified successfully: ${command.id}`);
    return updated;
  }
}
