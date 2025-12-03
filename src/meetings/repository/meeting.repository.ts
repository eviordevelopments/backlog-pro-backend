import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { Meeting } from '../domain/entities/meeting.entity';
import { IMeetingRepository } from '../domain/interfaces/meeting.repository.interface';

import { MeetingTypeOrmEntity } from './entities/meeting.typeorm-entity';
import { MeetingMapper } from './mappers/meeting.mapper';

@Injectable()
export class MeetingRepository implements IMeetingRepository {
  constructor(
    @InjectRepository(MeetingTypeOrmEntity)
    private readonly repository: Repository<MeetingTypeOrmEntity>,
    private readonly mapper: MeetingMapper,
  ) {}

  async create(meeting: Meeting): Promise<Meeting> {
    const entity = this.repository.create(this.mapper.toPersistence(meeting));
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async update(id: string, meeting: Partial<Meeting>): Promise<Meeting> {
    await this.repository.update(id, this.mapper.toPersistence(meeting as Meeting));
    const updated = await this.repository.findOneBy({ id });
    if (!updated) {
      throw new Error(`Meeting with id ${id} not found`);
    }
    return this.mapper.toDomain(updated);
  }

  async getById(id: string): Promise<Meeting | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async getByProjectId(projectId: string): Promise<Meeting[]> {
    const entities = await this.repository.findBy({ projectId });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async getBySprintId(sprintId: string): Promise<Meeting[]> {
    const entities = await this.repository.findBy({ sprintId });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async list(): Promise<Meeting[]> {
    const entities = await this.repository.find({
      where: { deletedAt: IsNull() },
    });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
