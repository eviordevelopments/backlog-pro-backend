import { Injectable } from '@nestjs/common';

import { TaskRepository } from '../../repository/task.repository';
import { AddDependencyCommandHandler } from '../commands/add-dependency.command-handler';
import { AddDependencyCommand } from '../commands/add-dependency.command';
import { AddSubtasksCommandHandler } from '../commands/add-subtasks.command-handler';
import { AddSubtasksCommand } from '../commands/add-subtasks.command';
import { AssignTaskCommandHandler } from '../commands/assign-task.command-handler';
import { AssignTaskCommand } from '../commands/assign-task.command';
import { CreateTaskCommandHandler } from '../commands/create-task.command-handler';
import { CreateTaskCommand } from '../commands/create-task.command';
import { UpdateTaskCommandHandler } from '../commands/update-task.command-handler';
import { UpdateTaskCommand } from '../commands/update-task.command';
import { GetTaskQueryHandler } from '../queries/get-task.query-handler';
import { GetTaskQuery } from '../queries/get-task.query';
import { ListTasksSprintQueryHandler } from '../queries/list-tasks-sprint.query-handler';
import { ListTasksSprintQuery } from '../queries/list-tasks-sprint.query';

@Injectable()
export class TaskService {
  constructor(
    private readonly createTaskHandler: CreateTaskCommandHandler,
    private readonly updateTaskHandler: UpdateTaskCommandHandler,
    private readonly assignTaskHandler: AssignTaskCommandHandler,
    private readonly addSubtasksHandler: AddSubtasksCommandHandler,
    private readonly addDependencyHandler: AddDependencyCommandHandler,
    private readonly getTaskHandler: GetTaskQueryHandler,
    private readonly listTasksHandler: ListTasksSprintQueryHandler,
    private readonly taskRepository: TaskRepository,
  ) {}

  async createTask(command: CreateTaskCommand) {
    return this.createTaskHandler.handle(command);
  }

  async updateTask(command: UpdateTaskCommand) {
    return this.updateTaskHandler.handle(command);
  }

  async assignTask(command: AssignTaskCommand) {
    return this.assignTaskHandler.handle(command);
  }

  async addSubtasks(command: AddSubtasksCommand) {
    return this.addSubtasksHandler.handle(command);
  }

  async addDependency(command: AddDependencyCommand) {
    return this.addDependencyHandler.handle(command);
  }

  async getTask(query: GetTaskQuery) {
    return this.getTaskHandler.handle(query);
  }

  async listTasksBySprint(query: ListTasksSprintQuery) {
    return this.listTasksHandler.handle(query);
  }

  async deleteTask(taskId: string) {
    return this.taskRepository.delete(taskId);
  }
}
