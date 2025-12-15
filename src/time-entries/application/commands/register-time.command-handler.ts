import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { InvalidTimeEntryAssignmentException } from '../../domain/exceptions/invalid-time-entry-assignment.exception';
import { TaskRepository } from '../../../tasks/repository/task.repository';
import { TimeEntry } from '../../domain/entities/time-entry.entity';
import { TimeEntryRepository } from '../../repository/time-entry.repository';
import { RegisterTimeCommand } from './register-time.command';

@Injectable()
export class RegisterTimeCommandHandler {
  private readonly logger = new Logger(RegisterTimeCommandHandler.name);

  constructor(
    private readonly timeEntryRepository: TimeEntryRepository,
    private readonly taskRepository: TaskRepository,
  ) {}

  async handle(command: RegisterTimeCommand): Promise<TimeEntry> {
    this.logger.log(
      `Registering time: ${command.hours} hours for task ${command.taskId} by user ${command.userId}`,
    );

    // Verify task exists and user is assigned
    const task = await this.taskRepository.getById(command.taskId);
    if (!task || task.getAssignedTo() !== command.userId) {
      throw new InvalidTimeEntryAssignmentException(command.userId, command.taskId);
    }

    const timeEntry = new TimeEntry(
      command.taskId,
      command.userId,
      command.hours,
      command.date,
      command.description,
      uuidv4(),
    );

    const created = await this.timeEntryRepository.create(timeEntry);

    // Update task actual_hours
    const currentHours = task.getActualHours();
    task.setActualHours(currentHours + command.hours);
    await this.taskRepository.update(command.taskId, task);

    this.logger.log(`Time registered successfully: ${created.getId()}`);
    return created;
  }
}
