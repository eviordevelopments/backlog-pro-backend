import { Injectable, Logger } from '@nestjs/common';

import { Task } from '../../domain/entities/task.entity';
import { TaskRepository } from '../../repository/task.repository';

import { ListTasksSprintQuery } from './list-tasks-sprint.query';

@Injectable()
export class ListTasksSprintQueryHandler {
  private readonly logger = new Logger(ListTasksSprintQueryHandler.name);

  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(query: ListTasksSprintQuery): Promise<Task[]> {
    this.logger.log(`Listing tasks for sprint: ${query.sprintId}`);

    const tasks = await this.taskRepository.listBySprint(query.sprintId);
    return tasks;
  }
}
