import { Injectable, Logger } from '@nestjs/common';
import { GetTaskQuery } from '@tasks/application/queries/get-task.query';
import { Task } from '@tasks/domain/entities/task.entity';
import { TaskRepository } from '@tasks/repository/task.repository';
import { TaskNotFoundException } from '@tasks/domain/exceptions';

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
