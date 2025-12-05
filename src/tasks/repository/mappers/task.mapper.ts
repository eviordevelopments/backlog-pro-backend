import { Injectable } from '@nestjs/common';

import { Task } from '../../domain/entities/task.entity';
import { TaskPriority } from '../../domain/value-objects/task-priority.vo';
import { TaskStatus } from '../../domain/value-objects/task-status.vo';
import { TaskTypeOrmEntity } from '../entities/task.typeorm-entity';

@Injectable()
export class TaskMapper {
  toDomain(entity: TaskTypeOrmEntity): Task {
    return new Task(
      entity.title,
      entity.projectId,
      entity.description || '',
      entity.id,
      entity.sprintId || null,
      TaskStatus.fromString(entity.status),
      TaskPriority.fromString(entity.priority),
      entity.assignedTo || null,
      Number(entity.estimatedHours),
      Number(entity.actualHours),
      entity.storyPoints,
      entity.dueDate || null,
      entity.tags,
      entity.dependencies,
      entity.subtasks,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt || null,
    );
  }

  toPersistence(domain: Task): TaskTypeOrmEntity {
    const entity = new TaskTypeOrmEntity();
    entity.id = domain.getId();
    entity.title = domain.getTitle();
    entity.description = domain.getDescription() || undefined;
    entity.projectId = domain.getProjectId();
    entity.sprintId = domain.getSprintId() || undefined;
    entity.status = domain.getStatus().getValue();
    entity.priority = domain.getPriority().getValue();
    entity.assignedTo = domain.getAssignedTo() || undefined;
    entity.estimatedHours = domain.getEstimatedHours();
    entity.actualHours = domain.getActualHours();
    entity.storyPoints = domain.getStoryPoints();
    entity.dueDate = domain.getDueDate() || undefined;
    entity.tags = domain.getTags();
    entity.dependencies = domain.getDependencies();
    entity.subtasks = domain.getSubtasks();
    entity.createdAt = domain.getCreatedAt();
    entity.updatedAt = domain.getUpdatedAt();
    entity.deletedAt = domain.getDeletedAt() || undefined;
    return entity;
  }
}
