import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Feedback } from '@feedback/domain/entities/feedback.entity';
import { FeedbackTypeOrmEntity } from '@feedback/repository/entities/feedback.typeorm-entity';
import { FeedbackMapper } from '@feedback/repository/mappers/feedback.mapper';
import { IFeedbackRepository } from '@feedback/domain/interfaces/feedback.repository.interface';

@Injectable()
export class FeedbackRepository implements IFeedbackRepository {
  constructor(
    @InjectRepository(FeedbackTypeOrmEntity)
    private readonly repository: Repository<FeedbackTypeOrmEntity>,
    private readonly mapper: FeedbackMapper,
  ) {}

  async create(feedback: Feedback): Promise<Feedback> {
    const entity = this.repository.create(this.mapper.toPersistence(feedback));
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async update(id: string, feedback: Partial<Feedback>): Promise<Feedback> {
    await this.repository.update(id, this.mapper.toPersistence(feedback as Feedback));
    const updated = await this.repository.findOneBy({ id });
    if (!updated) {
      throw new Error(`Feedback with id ${id} not found`);
    }
    return this.mapper.toDomain(updated);
  }

  async getById(id: string): Promise<Feedback | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async getByToUserId(toUserId: string): Promise<Feedback[]> {
    const entities = await this.repository.find({
      where: { toUserId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async getBySprintId(sprintId: string): Promise<Feedback[]> {
    const entities = await this.repository.findBy({ sprintId });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async list(): Promise<Feedback[]> {
    const entities = await this.repository.find({
      where: { deletedAt: IsNull() },
    });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
