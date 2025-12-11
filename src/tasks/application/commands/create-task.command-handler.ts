import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { ProjectRepository } from '../../../projects/repository/project.repository';
import { Task } from '../../domain/entities/task.entity';
import { TaskRepository } from '../../repository/task.repository';

import { CreateTaskCommand } from './create-task.command';

@Injectable()
export class CreateTaskCommandHandler {
  private readonly logger = new Logger(CreateTaskCommandHandler.name);

  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async handle(command: CreateTaskCommand): Promise<Task> {
    this.logger.log(`Creating task: ${command.title}`);

    // Validate that the project exists
    const project = await this.projectRepository.getById(command.projectId);
    if (!project) {
      throw new NotFoundException(`Project with ID ${command.projectId} not found`);
    }

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
