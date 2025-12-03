import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { UserStory } from '../domain/entities/user-story.entity';
import { IUserStoryRepository } from '../domain/interfaces/user-story.repository.interface';

import { UserStoryTypeOrmEntity } from './entities/user-story.typeorm-entity';
import { UserStoryMapper } from './mappers/user-story.mapper';

@Injectable()
export class UserStoryRepository implements IUserStoryRepository {
  constructor(
    @InjectRepository(UserStoryTypeOrmEntity)
    private readonly repository: Repository<UserStoryTypeOrmEntity>,
    private readonly mapper: UserStoryMapper,
  ) {}

  async create(userStory: UserStory): Promise<UserStory> {
    const entity = this.repository.create(this.mapper.toPersistence(userStory));
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async update(id: string, userStory: Partial<UserStory>): Promise<UserStory> {
    await this.repository.update(id, this.mapper.toPersistence(userStory as UserStory));
    const updated = await this.repository.findOneBy({ id });
    if (!updated) {
      throw new Error(`UserStory with id ${id} not found`);
    }
    return this.mapper.toDomain(updated);
  }

  async getById(id: string): Promise<UserStory | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async getByProjectId(projectId: string): Promise<UserStory[]> {
    const entities = await this.repository.findBy({ projectId });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async getBySprintId(sprintId: string): Promise<UserStory[]> {
    const entities = await this.repository.findBy({ sprintId });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async getBacklog(projectId: string): Promise<UserStory[]> {
    const entities = await this.repository.find({
      where: { projectId, status: 'backlog', deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async list(): Promise<UserStory[]> {
    const entities = await this.repository.find({
      where: { deletedAt: IsNull() },
    });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
