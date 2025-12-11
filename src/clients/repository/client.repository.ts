import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { Client } from '../domain/entities/client.entity';
import { IClientRepository } from '../domain/interfaces/client.repository.interface';

import { ClientTypeOrmEntity } from './entities/client.typeorm-entity';
import { ClientMapper } from './mappers/client.mapper';

@Injectable()
export class ClientRepository implements IClientRepository {
  private readonly logger = new Logger(ClientRepository.name);

  constructor(
    @InjectRepository(ClientTypeOrmEntity)
    private readonly repository: Repository<ClientTypeOrmEntity>,
    private readonly mapper: ClientMapper,
  ) {}

  async create(client: Client): Promise<Client> {
    this.logger.log(`Creating client: ${client.getName()}`);
    const entity = this.mapper.toPersistence(client);
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async update(id: string, data: Partial<Client>): Promise<Client> {
    this.logger.log(`Updating client: ${id}`);
    const entity = await this.repository.findOne({ where: { id, deletedAt: IsNull() } });
    if (!entity) {
      throw new Error(`Client not found: ${id}`);
    }

    const domain = this.mapper.toDomain(entity);

    if (data.getName) {
      domain.setName(data.getName());
    }
    if (data.getEmail) {
      domain.setEmail(data.getEmail());
    }
    if (data.getPhone) {
      domain.setPhone(data.getPhone());
    }
    if (data.getCompany) {
      domain.setCompany(data.getCompany());
    }
    if (data.getIndustry) {
      domain.setIndustry(data.getIndustry());
    }
    if (data.getStatus) {
      domain.setStatus(data.getStatus());
    }
    if (data.getLtv !== undefined) {
      domain.setLtv(data.getLtv());
    }
    if (data.getCac !== undefined) {
      domain.setCac(data.getCac());
    }
    if (data.getMrr !== undefined) {
      domain.setMrr(data.getMrr());
    }
    if (data.getContractStart) {
      domain.setContractStart(data.getContractStart());
    }
    if (data.getContractEnd) {
      domain.setContractEnd(data.getContractEnd());
    }
    if (data.getNpsScore !== undefined) {
      domain.setNpsScore(data.getNpsScore());
    }
    if (data.getCsatScore !== undefined) {
      domain.setCsatScore(data.getCsatScore());
    }
    if (data.getNotes) {
      domain.setNotes(data.getNotes());
    }

    const updated = this.mapper.toPersistence(domain);
    const saved = await this.repository.save(updated);
    return this.mapper.toDomain(saved);
  }

  async getById(id: string): Promise<Client | null> {
    this.logger.log(`Getting client: ${id}`);
    const entity = await this.repository.findOne({ where: { id, deletedAt: IsNull() } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async list(): Promise<Client[]> {
    this.logger.log('Listing clients');
    const entities = await this.repository.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
    return entities.map((e) => this.mapper.toDomain(e));
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting client: ${id}`);
    await this.repository.update({ id }, { deletedAt: new Date() });
  }

  async deleteWithCascade(id: string): Promise<void> {
    this.logger.log(`Deleting client with cascade: ${id}`);

    const deletedAt = new Date();

    // Soft delete the client
    await this.repository.update({ id }, { deletedAt });

    // Cascade soft delete: mark all projects of this client as deleted
    await this.repository.manager.query(
      'UPDATE projects SET "deletedAt" = $1 WHERE "clientId" = $2 AND "deletedAt" IS NULL',
      [deletedAt, id],
    );

    this.logger.log(`Client ${id} and associated projects soft deleted`);
  }
}
