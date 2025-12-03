import { Injectable, Logger } from '@nestjs/common';
import { TaskRepository } from 'src/tasks/repository/task.repository';
import { Task } from '../../domain/entities/task.entity';
import { CycleDetectedException, TaskNotFoundException } from '../../domain/exceptions/index';
import { AddDependencyCommand } from './add-dependency.command';

@Injectable()
export class AddDependencyCommandHandler {
  private readonly logger = new Logger(AddDependencyCommandHandler.name);

  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(command: AddDependencyCommand): Promise<Task> {
    this.logger.log(
      `Adding dependency: task ${command.taskId} depends on ${command.dependsOnTaskId}`,
    );

    const task = await this.taskRepository.getById(command.taskId);
    if (!task) {
      throw new TaskNotFoundException(command.taskId);
    }

    const dependsOnTask = await this.taskRepository.getById(command.dependsOnTaskId);
    if (!dependsOnTask) {
      throw new TaskNotFoundException(command.dependsOnTaskId);
    }

    // Check for cycles
    if (this.wouldCreateCycle(task, dependsOnTask)) {
      throw new CycleDetectedException();
    }

    task.addDependency(command.dependsOnTaskId);
    const updated = await this.taskRepository.update(command.taskId, task);
    this.logger.log(`Dependency added successfully: ${command.taskId}`);
    return updated;
  }

  private wouldCreateCycle(task: Task, dependsOnTask: Task): boolean {
    // Simple cycle detection: check if dependsOnTask depends on task
    return dependsOnTask.getDependencies().includes(task.getId());
  }
}
