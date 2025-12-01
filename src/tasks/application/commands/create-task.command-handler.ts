import { Injectable, Logger } from '@nestjs/common';
import { CreateTaskCommand } from '@tasks/application/commands/create-task.command';
import { Task } from '@tasks/domain/entities/task.entity';
import { TaskRepository } from '@tasks/repository/task.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateTaskCommandHandler {
  private readonly logger = new Logger(CreateTaskCommandHandler.name);

  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(command: CreateTaskCommand): Promise<Task> {
    this.logger.log(`Creating task: ${command.title}`);

    const task = new Task(
      command.title,
      command.projectId,
      command.description,
      uuidv4(),
      command.sprintId || null,
      undefined,
      undefined,
      null,
      command.estimatedHours || 0,
      0,
      command.storyPoints || 0,
      command.dueDate || null,
      command.tags || [],
    );

    const created = await this.taskRepository.create(task);
    this.logger.log(`Task created successfully: ${created.getId()}`);
    return created;
  }
}
