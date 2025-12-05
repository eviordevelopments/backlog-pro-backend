import { Injectable } from '@nestjs/common';

import { Invoice, InvoiceItem } from '../../domain/entities/invoice.entity';
import { Amount } from '../../domain/value-objects/amount.vo';
import { InvoiceStatus } from '../../domain/value-objects/invoice-status.vo';
import { InvoiceTypeOrmEntity } from '../entities/invoice.typeorm-entity';

@Injectable()
export class InvoiceMapper {
  toDomain(raw: InvoiceTypeOrmEntity): Invoice {
    return new Invoice(
      raw.invoiceNumber,
      raw.clientId,
      Amount.create(Number(raw.amount)),
      Amount.create(Number(raw.tax)),
      raw.issueDate,
      raw.dueDate,
      InvoiceStatus.create(raw.status),
      raw.projectId,
      raw.paidDate,
      (raw.items as InvoiceItem[]) || [],
      raw.notes || '',
      raw.id,
      raw.createdAt,
      raw.updatedAt,
      raw.deletedAt,
    );
  }

  toPersistence(invoice: Invoice): Partial<InvoiceTypeOrmEntity> {
    return {
      id: invoice.getId(),
      invoiceNumber: invoice.getInvoiceNumber(),
      clientId: invoice.getClientId(),
      projectId: invoice.getProjectId() ?? undefined,
      amount: invoice.getAmount().getValue(),
      tax: invoice.getTax().getValue(),
      total: invoice.getTotal().getValue(),
      status: invoice.getStatus().getValue(),
      issueDate: invoice.getIssueDate(),
      dueDate: invoice.getDueDate(),
      paidDate: invoice.getPaidDate() ?? undefined,
      items: invoice.getItems(),
      notes: invoice.getNotes(),
      createdAt: invoice.getCreatedAt(),
      updatedAt: invoice.getUpdatedAt(),
      deletedAt: invoice.getDeletedAt() ?? undefined,
    };
  }
}
