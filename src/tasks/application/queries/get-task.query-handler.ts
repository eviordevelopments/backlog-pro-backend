import { Injectable, Logger } from '@nestjs/common';

import { Task } from '../../domain/entities/task.entity';
import { TaskNotFoundException } from '../../domain/exceptions/index';
import { TaskRepository } from '../../repository/task.repository';

import { GetTaskQuery } from './get-task.query';

@Injectable()
export class GetTaskQueryHandler {
  private readonly logger = new Logger(GetTaskQueryHandler.name);

  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(query: GetTaskQuery): Promise<Task> {
    this.logger.log(`Getting task: ${query.id}`);

    const task = await this.taskRepository.getById(query.id);
    if (!task) {
      throw new TaskNotFoundException(query.id);
    }

    return task;
  }
}
