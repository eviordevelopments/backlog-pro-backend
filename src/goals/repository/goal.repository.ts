import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Goal } from '@goals/domain/entities/goal.entity';
import { GoalTypeOrmEntity } from '@goals/repository/entities/goal.typeorm-entity';
import { GoalMapper } from '@goals/repository/mappers/goal.mapper';
import { IGoalRepository } from '@goals/domain/interfaces/goal.repository.interface';

@Injectable()
export class GoalRepository implements IGoalRepository {
  constructor(
    @InjectRepository(GoalTypeOrmEntity)
    private readonly repository: Repository<GoalTypeOrmEntity>,
    private readonly mapper: GoalMapper,
  ) {}

  async create(goal: Goal): Promise<Goal> {
    const entity = this.repository.create(this.mapper.toPersistence(goal));
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async update(id: string, goal: Partial<Goal>): Promise<Goal> {
    await this.repository.update(id, this.mapper.toPersistence(goal as Goal));
    const updated = await this.repository.findOneBy({ id });
    if (!updated) {
      throw new Error(`Goal with id ${id} not found`);
    }
    return this.mapper.toDomain(updated);
  }

  async getById(id: string): Promise<Goal | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async getByOwnerId(ownerId: string): Promise<Goal[]> {
    const entities = await this.repository.findBy({ ownerId });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async list(): Promise<Goal[]> {
    const entities = await this.repository.find({
      where: { deletedAt: IsNull() },
    });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
