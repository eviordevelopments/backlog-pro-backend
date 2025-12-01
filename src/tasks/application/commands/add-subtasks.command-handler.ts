import { Injectable, Logger } from '@nestjs/common';
import { AddSubtasksCommand } from '@tasks/application/commands/add-subtasks.command';
import { Task } from '@tasks/domain/entities/task.entity';
import { TaskRepository } from '@tasks/repository/task.repository';
import { TaskNotFoundException } from '@tasks/domain/exceptions';

@Injectable()
export class AddSubtasksCommandHandler {
  private readonly logger = new Logger(AddSubtasksCommandHandler.name);

  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(command: AddSubtasksCommand): Promise<Task> {
    this.logger.log(`Adding subtasks to task: ${command.taskId}`);

    const task = await this.taskRepository.getById(command.taskId);
    if (!task) {
      throw new TaskNotFoundException(command.taskId);
    }

    const currentSubtasks = task.getSubtasks();
    const updatedSubtasks = [...currentSubtasks, ...command.subtasks];
    task.setSubtasks(updatedSubtasks);

    const updated = await this.taskRepository.update(command.taskId, task);
    this.logger.log(`Subtasks added successfully: ${command.taskId}`);
    return updated;
  }
}
