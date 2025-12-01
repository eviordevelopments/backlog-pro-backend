import { Injectable, Logger } from '@nestjs/common';
import { UpdateTaskCommand } from '@tasks/application/commands/update-task.command';
import { Task } from '@tasks/domain/entities/task.entity';
import { TaskRepository } from '@tasks/repository/task.repository';
import { TaskNotFoundException } from '@tasks/domain/exceptions';
import { TaskStatus } from '@tasks/domain/value-objects/task-status.vo';
import { TaskPriority } from '@tasks/domain/value-objects/task-priority.vo';

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
