import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/entities/user.entity';
import { IUserRepository } from '../domain/interfaces/user.repository.interface';
import { UserTypeOrmEntity } from './entities/user.typeorm-entity';
import { UserMapper } from './mappers/user.mapper';
import { UserNotFoundException } from '../domain/exceptions/user-not-found.exception';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserTypeOrmEntity)
    private readonly repository: Repository<UserTypeOrmEntity>,
  ) {}

  async create(user: User): Promise<User> {
    const entity = UserMapper.toPersistence(user);
    const saved = await this.repository.save(entity);
    return UserMapper.toDomain(saved);
  }

  async getByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { email },
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async getById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    await this.repository.update(id, user);
    const updated = await this.repository.findOne({
      where: { id },
    });
    if (!updated) {
      throw new UserNotFoundException('unknown');
    }
    return UserMapper.toDomain(updated);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { email },
    });
    return count > 0;
  }
}
