import { Logger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import {
    AddDependencyCommand,
    AddSubtasksCommand,
    AssignTaskCommand,
    CreateTaskCommand,
    UpdateTaskCommand,
} from '../application/commands/index';
import { GetTaskQuery, ListTasksSprintQuery } from '../application/queries/index';
import { TaskService } from '../application/services/task.service';
import { Task } from '../domain/entities/task.entity';
import { CreateTaskDto } from '../dto/request/create-task.dto';
import { UpdateTaskDto } from '../dto/request/update-task.dto';
import { TaskResponseDto } from '../dto/response/task.response.dto';

@Resolver()
@UseGuards(JwtAuthGuard)
export class TaskResolver {
  private readonly logger = new Logger(TaskResolver.name);

  constructor(private readonly taskService: TaskService) {}

  @Mutation(() => TaskResponseDto, {
    description: 'Crea una nueva tarea',
  })
  async createTask(
    @Args('input', { description: 'Datos de la tarea a crear' }) input: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    this.logger.log(`Creando tarea: ${input.title}`);
    const command = new CreateTaskCommand(
      input.title,
      input.projectId,
      input.description,
      input.sprintId,
      input.estimatedHours,
      input.storyPoints,
      input.dueDate,
      input.tags,
    );

    const task = await this.taskService.createTask(command);
    return this.mapToResponse(task);
  }

  @Query(() => TaskResponseDto, {
    description: 'Obtiene una tarea por ID',
  })
  async getTask(
    @Args('taskId', { description: 'UUID de la tarea' }) taskId: string,
  ): Promise<TaskResponseDto> {
    this.logger.log(`Obteniendo tarea: ${taskId}`);
    const query = new GetTaskQuery(taskId);
    const task = await this.taskService.getTask(query);
    return this.mapToResponse(task);
  }

  @Query(() => [TaskResponseDto], {
    description: 'Lista todas las tareas de un sprint',
  })
  async listTasksBySprint(@Args('sprintId') sprintId: string): Promise<TaskResponseDto[]> {
    this.logger.log(`Listando tareas del sprint: ${sprintId}`);
    const query = new ListTasksSprintQuery(sprintId);
    const tasks = await this.taskService.listTasksBySprint(query);
    return tasks.map((t) => this.mapToResponse(t));
  }

  @Mutation(() => TaskResponseDto, {
    description: 'Actualiza una tarea',
  })
  async updateTask(
    @Args('taskId') taskId: string,
    @Args('input') input: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    this.logger.log(`Actualizando tarea: ${taskId}`);
    const command = new UpdateTaskCommand(
      taskId,
      input.title,
      input.description,
      input.status,
      input.priority,
      input.estimatedHours,
      input.storyPoints,
      input.dueDate,
      input.tags,
    );

    const task = await this.taskService.updateTask(command);
    return this.mapToResponse(task);
  }

  @Mutation(() => TaskResponseDto, {
    description: 'Asigna una tarea a un usuario',
  })
  async assignTask(
    @Args('taskId') taskId: string,
    @Args('userId') userId: string,
  ): Promise<TaskResponseDto> {
    this.logger.log(`Asignando tarea ${taskId} al usuario ${userId}`);
    const command = new AssignTaskCommand(taskId, userId);
    const task = await this.taskService.assignTask(command);
    return this.mapToResponse(task);
  }

  @Mutation(() => TaskResponseDto, {
    description: 'Agrega subtareas a una tarea',
  })
  async addSubtasks(
    @Args('taskId') taskId: string,
    @Args('subtasks', { type: () => [String] }) subtasks: string[],
  ): Promise<TaskResponseDto> {
    this.logger.log(`Agregando subtareas a la tarea: ${taskId}`);
    const command = new AddSubtasksCommand(taskId, subtasks);
    const task = await this.taskService.addSubtasks(command);
    return this.mapToResponse(task);
  }

  @Mutation(() => TaskResponseDto, {
    description: 'Agrega una dependencia a una tarea',
  })
  async addDependency(
    @Args('taskId') taskId: string,
    @Args('dependsOnTaskId') dependsOnTaskId: string,
  ): Promise<TaskResponseDto> {
    this.logger.log(`Agregando dependencia a la tarea: ${taskId}`);
    const command = new AddDependencyCommand(taskId, dependsOnTaskId);
    const task = await this.taskService.addDependency(command);
    return this.mapToResponse(task);
  }

  @Mutation(() => Boolean, {
    description: 'Elimina una tarea',
  })
  async deleteTask(@Args('taskId') taskId: string): Promise<boolean> {
    this.logger.log(`Eliminando tarea: ${taskId}`);
    await this.taskService.deleteTask(taskId);
    return true;
  }

  private mapToResponse(task: Task): TaskResponseDto {
    return {
      id: task.getId(),
      title: task.getTitle(),
      description: task.getDescription(),
      projectId: task.getProjectId(),
      sprintId: task.getSprintId() || undefined,
      status: task.getStatus().getValue(),
      priority: task.getPriority().getValue(),
      assignedTo: task.getAssignedTo() || undefined,
      estimatedHours: task.getEstimatedHours(),
      actualHours: task.getActualHours(),
      storyPoints: task.getStoryPoints(),
      dueDate: task.getDueDate() || undefined,
      tags: task.getTags(),
      dependencies: task.getDependencies(),
      createdAt: task.getCreatedAt(),
      updatedAt: task.getUpdatedAt(),
    };
  }
}
