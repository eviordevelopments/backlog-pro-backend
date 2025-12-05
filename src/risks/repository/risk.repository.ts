import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { Risk } from '../domain/entities/risk.entity';
import { IRiskRepository } from '../domain/interfaces/risk.repository.interface';

import { RiskTypeOrmEntity } from './entities/risk.typeorm-entity';
import { RiskMapper } from './mappers/risk.mapper';

@Injectable()
export class RiskRepository implements IRiskRepository {
  constructor(
    @InjectRepository(RiskTypeOrmEntity)
    private readonly repository: Repository<RiskTypeOrmEntity>,
    private readonly mapper: RiskMapper,
  ) {}

  async create(risk: Risk): Promise<Risk> {
    const entity = this.repository.create(this.mapper.toPersistence(risk));
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async update(id: string, risk: Partial<Risk>): Promise<Risk> {
    const persistence = this.mapper.toPersistence(risk as Risk);
    await this.repository.update(id, persistence as Parameters<typeof this.repository.update>[1]);
    const updated = await this.repository.findOneBy({ id });
    if (!updated) {
      throw new Error(`Risk with id ${id} not found`);
    }
    return this.mapper.toDomain(updated);
  }

  async getById(id: string): Promise<Risk | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async getByProjectId(projectId: string): Promise<Risk[]> {
    const entities = await this.repository.findBy({ projectId });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async list(): Promise<Risk[]> {
    const entities = await this.repository.find({
      where: { deletedAt: IsNull() },
    });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
