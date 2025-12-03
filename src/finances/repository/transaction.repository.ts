import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { Transaction } from '../domain/entities/transaction.entity';
import { ITransactionRepository } from '../domain/interfaces/transaction.repository.interface';

import { TransactionTypeOrmEntity } from './entities/transaction.typeorm-entity';
import { TransactionMapper } from './mappers/transaction.mapper';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(TransactionTypeOrmEntity)
    private readonly repository: Repository<TransactionTypeOrmEntity>,
    private readonly mapper: TransactionMapper,
  ) {}

  async create(transaction: Transaction): Promise<Transaction> {
    const entity = this.repository.create(this.mapper.toPersistence(transaction));
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async update(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    await this.repository.update(id, this.mapper.toPersistence(transaction as Transaction));
    const updated = await this.repository.findOneBy({ id });
    if (!updated) {
      throw new Error(`Transaction with id ${id} not found`);
    }
    return this.mapper.toDomain(updated);
  }

  async getById(id: string): Promise<Transaction | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async getByProjectId(projectId: string): Promise<Transaction[]> {
    const entities = await this.repository.findBy({ projectId });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async getByClientId(clientId: string): Promise<Transaction[]> {
    const entities = await this.repository.findBy({ clientId });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async list(): Promise<Transaction[]> {
    const entities = await this.repository.find({
      where: { deletedAt: IsNull() },
    });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
