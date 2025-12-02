import { Injectable, Logger } from '@nestjs/common';
import { ListTasksSprintQuery } from '@tasks/application/queries/list-tasks-sprint.query';
import { Task } from '@tasks/domain/entities/task.entity';
import { TaskRepository } from '@tasks/repository/task.repository';

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
