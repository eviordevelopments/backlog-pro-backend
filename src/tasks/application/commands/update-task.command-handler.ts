import { Injectable, Logger } from '@nestjs/common';

import { Task } from '../../domain/entities/task.entity';
import { TaskNotFoundException } from '../../domain/exceptions/index';
import { TaskPriority } from '../../domain/value-objects/task-priority.vo';
import { TaskStatus } from '../../domain/value-objects/task-status.vo';
import { TaskRepository } from '../../repository/task.repository';

import { UpdateTaskCommand } from './update-task.command';

@Injectable()
export class UpdateTaskCommandHandler {
  private readonly logger = new Logger(UpdateTaskCommandHandler.name);

  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(command: UpdateTaskCommand): Promise<Task> {
    this.logger.log(`Updating task: ${command.id}`);

    const task = await this.taskRepository.getById(command.id);
    if (!task) {
      throw new TaskNotFoundException(command.id);
    }

    if (command.title) {
      task.setTitle(command.title);
    }

    if (command.description) {
      task.setDescription(command.description);
    }

    if (command.status) {
      task.setStatus(TaskStatus.fromString(command.status));
    }

    if (command.priority) {
      task.setPriority(TaskPriority.fromString(command.priority));
    }

    if (command.estimatedHours !== undefined) {
      task.setEstimatedHours(command.estimatedHours);
    }

    if (command.storyPoints !== undefined) {
      task.setStoryPoints(command.storyPoints);
    }

    if (command.dueDate) {
      task.setDueDate(command.dueDate);
    }

    if (command.tags) {
      task.setTags(command.tags);
    }

    const updated = await this.taskRepository.update(command.id, task);
    this.logger.log(`Task updated successfully: ${command.id}`);
    return updated;
  }
}
