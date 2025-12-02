import { Injectable } from '@nestjs/common';
import { CreateTaskCommandHandler } from '@tasks/application/commands/create-task.command-handler';
import { UpdateTaskCommandHandler } from '@tasks/application/commands/update-task.command-handler';
import { AssignTaskCommandHandler } from '@tasks/application/commands/assign-task.command-handler';
import { AddSubtasksCommandHandler } from '@tasks/application/commands/add-subtasks.command-handler';
import { AddDependencyCommandHandler } from '@tasks/application/commands/add-dependency.command-handler';
import { GetTaskQueryHandler } from '@tasks/application/queries/get-task.query-handler';
import { ListTasksSprintQueryHandler } from '@tasks/application/queries/list-tasks-sprint.query-handler';
import { TaskRepository } from '@tasks/repository/task.repository';

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

  async createTask(command: any) {
    return this.createTaskHandler.handle(command);
  }

  async updateTask(command: any) {
    return this.updateTaskHandler.handle(command);
  }

  async assignTask(command: any) {
    return this.assignTaskHandler.handle(command);
  }

  async addSubtasks(command: any) {
    return this.addSubtasksHandler.handle(command);
  }

  async addDependency(command: any) {
    return this.addDependencyHandler.handle(command);
  }

  async getTask(query: any) {
    return this.getTaskHandler.handle(query);
  }

  async listTasksBySprint(query: any) {
    return this.listTasksHandler.handle(query);
  }

  async deleteTask(taskId: string) {
    return this.taskRepository.delete(taskId);
  }
}
