import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from '../domain/entities/user-profile.entity';
import { IUserProfileRepository } from '../domain/interfaces/user-profile.repository.interface';
import { UserProfileTypeOrmEntity } from './entities/user-profile.typeorm-entity';
import { UserProfileMapper } from './mappers/user-profile.mapper';

@Injectable()
export class UserProfileRepository implements IUserProfileRepository {
  constructor(
    @InjectRepository(UserProfileTypeOrmEntity)
    private readonly repository: Repository<UserProfileTypeOrmEntity>,
  ) {}

  async create(userProfile: UserProfile): Promise<UserProfile> {
    const entity = UserProfileMapper.toPersistence(userProfile);
    const saved = await this.repository.save(entity);
    return UserProfileMapper.toDomain(saved);
  }

  async getByUserId(userId: string): Promise<UserProfile | null> {
    const entity = await this.repository.findOne({
      where: { userId },
    });
    return entity ? UserProfileMapper.toDomain(entity) : null;
  }

  async update(userId: string, userProfile: Partial<UserProfile>): Promise<UserProfile> {
    await this.repository.update({ userId }, userProfile);
    const updated = await this.repository.findOne({
      where: { userId },
    });
    if (!updated) {
      throw new Error(`UserProfile with userId ${userId} not found`);
    }
    return UserProfileMapper.toDomain(updated);
  }

  async getWorkedHoursByUserId(userId: string): Promise<number> {
    // Esta consulta se implementará cuando se tenga el módulo de time-entries
    // Por ahora retorna 0
    return 0;
  }

  async getWorkedHoursByUserIdAndProject(userId: string, projectId: string): Promise<number> {
    // Esta consulta se implementará cuando se tenga el módulo de time-entries
    // Por ahora retorna 0
    return 0;
  }
}
