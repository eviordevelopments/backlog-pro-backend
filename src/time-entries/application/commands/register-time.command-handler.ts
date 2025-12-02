import { Injectable, Logger } from '@nestjs/common';
import { RegisterTimeCommand } from '@time-entries/application/commands/register-time.command';
import { TimeEntry } from '@time-entries/domain/entities/time-entry.entity';
import { TimeEntryRepository } from '@time-entries/repository/time-entry.repository';
import { TaskRepository } from '@tasks/repository/task.repository';
import { InvalidTimeEntryAssignmentException } from '@time-entries/domain/exceptions';
import { v4 as uuidv4 } from 'uuid';

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
