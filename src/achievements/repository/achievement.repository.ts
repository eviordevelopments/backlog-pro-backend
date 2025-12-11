import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Achievement, UserAchievement } from '../domain/entities/achievement.entity';
import {
    IAchievementRepository,
    IUserAchievementRepository,
} from '../domain/interfaces/achievement.repository.interface';

import {
    AchievementTypeOrmEntity,
    UserAchievementTypeOrmEntity,
} from './entities/achievement.typeorm-entity';
import { AchievementMapper, UserAchievementMapper } from './mappers/achievement.mapper';

@Injectable()
export class AchievementRepository implements IAchievementRepository {
  constructor(
    @InjectRepository(AchievementTypeOrmEntity)
    private readonly repository: Repository<AchievementTypeOrmEntity>,
    private readonly mapper: AchievementMapper,
  ) {}

  async create(achievement: Achievement): Promise<Achievement> {
    const entity = this.repository.create(this.mapper.toPersistence(achievement));
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async getById(id: string): Promise<Achievement | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async list(): Promise<Achievement[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.mapper.toDomain(entity));
  }
}

@Injectable()
export class UserAchievementRepository implements IUserAchievementRepository {
  constructor(
    @InjectRepository(UserAchievementTypeOrmEntity)
    private readonly repository: Repository<UserAchievementTypeOrmEntity>,
    private readonly mapper: UserAchievementMapper,
  ) {}

  async create(userAchievement: UserAchievement): Promise<UserAchievement> {
    const entity = this.repository.create(this.mapper.toPersistence(userAchievement));
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async getByUserId(userId: string): Promise<UserAchievement[]> {
    const entities = await this.repository.findBy({ userId });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async getByUserAndAchievement(
    userId: string,
    achievementId: string,
  ): Promise<UserAchievement | null> {
    const entity = await this.repository.findOneBy({ userId, achievementId });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async list(): Promise<UserAchievement[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.mapper.toDomain(entity));
  }
}
