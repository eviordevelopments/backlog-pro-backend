import { Injectable, Logger } from '@nestjs/common';

import { InvalidTaskAssignmentException } from '../../domain/exceptions/invalid-task-assignment.exception';
import { TaskNotFoundException } from '../../domain/exceptions/task-not-found.exception';
import { ProjectMemberRepository } from '../../../projects/repository/project-member.repository';
import { Task } from '../../domain/entities/task.entity';
import { TaskRepository } from '../../repository/task.repository';
import { AssignTaskCommand } from './assign-task.command';

@Injectable()
export class AssignTaskCommandHandler {
  private readonly logger = new Logger(AssignTaskCommandHandler.name);

  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly projectMemberRepository: ProjectMemberRepository,
  ) {}

  async handle(command: AssignTaskCommand): Promise<Task> {
    this.logger.log(`Assigning task ${command.taskId} to user ${command.userId}`);

    const task = await this.taskRepository.getById(command.taskId);
    if (!task) {
      throw new TaskNotFoundException(command.taskId);
    }

    // Verify user is a member of the project
    const isMember = await this.projectMemberRepository.existsByProjectAndUser(
      task.getProjectId(),
      command.userId,
    );

    if (!isMember) {
      throw new InvalidTaskAssignmentException(command.userId, task.getProjectId());
    }

    task.setAssignedTo(command.userId);
    const updated = await this.taskRepository.update(command.taskId, task);
    this.logger.log(`Task assigned successfully: ${command.taskId}`);
    return updated;
  }
}
