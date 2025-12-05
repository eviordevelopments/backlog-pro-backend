import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { Invoice } from '../domain/entities/invoice.entity';
import { IInvoiceRepository } from '../domain/interfaces/invoice.repository.interface';

import { InvoiceTypeOrmEntity } from './entities/invoice.typeorm-entity';
import { InvoiceMapper } from './mappers/invoice.mapper';

@Injectable()
export class InvoiceRepository implements IInvoiceRepository {
  constructor(
    @InjectRepository(InvoiceTypeOrmEntity)
    private readonly repository: Repository<InvoiceTypeOrmEntity>,
    private readonly mapper: InvoiceMapper,
  ) {}

  async create(invoice: Invoice): Promise<Invoice> {
    const entity = this.repository.create(this.mapper.toPersistence(invoice));
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async update(id: string, invoice: Partial<Invoice>): Promise<Invoice> {
    const persistence = this.mapper.toPersistence(invoice as Invoice);
    await this.repository.update(id, persistence as Parameters<typeof this.repository.update>[1]);
    const updated = await this.repository.findOneBy({ id });
    if (!updated) {
      throw new Error(`Invoice with id ${id} not found`);
    }
    return this.mapper.toDomain(updated);
  }

  async getById(id: string): Promise<Invoice | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async getByInvoiceNumber(invoiceNumber: string): Promise<Invoice | null> {
    const entity = await this.repository.findOneBy({ invoiceNumber });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async getByClientId(clientId: string): Promise<Invoice[]> {
    const entities = await this.repository.findBy({ clientId });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async getByProjectId(projectId: string): Promise<Invoice[]> {
    const entities = await this.repository.findBy({ projectId });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async list(): Promise<Invoice[]> {
    const entities = await this.repository.find({
      where: { deletedAt: IsNull() },
    });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
