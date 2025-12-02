import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Invoice } from '@finances/domain/entities/invoice.entity';
import { InvoiceTypeOrmEntity } from '@finances/repository/entities/invoice.typeorm-entity';
import { InvoiceMapper } from '@finances/repository/mappers/invoice.mapper';
import { IInvoiceRepository } from '@finances/domain/interfaces/invoice.repository.interface';

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
    await this.repository.update(id, this.mapper.toPersistence(invoice as Invoice));
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
