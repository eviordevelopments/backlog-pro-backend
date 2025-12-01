import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Task } from '@tasks/domain/entities/task.entity';
import { TaskTypeOrmEntity } from '@tasks/repository/entities/task.typeorm-entity';
import { TaskMapper } from '@tasks/repository/mappers/task.mapper';
import { ITaskRepository } from '@tasks/domain/interfaces/task.repository.interface';

@Injectable()
export class TaskRepository implements ITaskRepository {
  private readonly logger = new Logger(TaskRepository.name);

  constructor(
    @InjectRepository(TaskTypeOrmEntity)
    private readonly repository: Repository<TaskTypeOrmEntity>,
    private readonly mapper: TaskMapper,
  ) {}

  async create(task: Task): Promise<Task> {
    this.logger.log(`Creating task: ${task.getTitle()}`);
    const entity = this.mapper.toPersistence(task);
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async update(id: string, data: Partial<Task>): Promise<Task> {
    this.logger.log(`Updating task: ${id}`);
    const entity = await this.repository.findOne({ where: { id, deletedAt: IsNull() } });
    if (!entity) {
      throw new Error(`Task not found: ${id}`);
    }

    const domain = this.mapper.toDomain(entity);

    if (data.getTitle) {
      domain.setTitle(data.getTitle());
    }
    if (data.getDescription) {
      domain.setDescription(data.getDescription());
    }
    if (data.getSprintId) {
      domain.setSprintId(data.getSprintId());
    }
    if (data.getStatus) {
      domain.setStatus(data.getStatus());
    }
    if (data.getPriority) {
      domain.setPriority(data.getPriority());
    }
    if (data.getAssignedTo) {
      domain.setAssignedTo(data.getAssignedTo());
    }
    if (data.getEstimatedHours !== undefined) {
      domain.setEstimatedHours(data.getEstimatedHours());
    }
    if (data.getActualHours !== undefined) {
      domain.setActualHours(data.getActualHours());
    }
    if (data.getStoryPoints !== undefined) {
      domain.setStoryPoints(data.getStoryPoints());
    }
    if (data.getDueDate) {
      domain.setDueDate(data.getDueDate());
    }
    if (data.getTags) {
      domain.setTags(data.getTags());
    }
    if (data.getDependencies) {
      domain.setDependencies(data.getDependencies());
    }
    if (data.getSubtasks) {
      domain.setSubtasks(data.getSubtasks());
    }

    const updated = this.mapper.toPersistence(domain);
    const saved = await this.repository.save(updated);
    return this.mapper.toDomain(saved);
  }

  async getById(id: string): Promise<Task | null> {
    this.logger.log(`Getting task: ${id}`);
    const entity = await this.repository.findOne({ where: { id, deletedAt: IsNull() } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async listByProject(projectId: string): Promise<Task[]> {
    this.logger.log(`Listing tasks for project: ${projectId}`);
    const entities = await this.repository.find({
      where: { projectId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
    return entities.map((e) => this.mapper.toDomain(e));
  }

  async listBySprint(sprintId: string): Promise<Task[]> {
    this.logger.log(`Listing tasks for sprint: ${sprintId}`);
    const entities = await this.repository.find({
      where: { sprintId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
    return entities.map((e) => this.mapper.toDomain(e));
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting task: ${id}`);
    await this.repository.update({ id }, { deletedAt: new Date() });
  }
}
