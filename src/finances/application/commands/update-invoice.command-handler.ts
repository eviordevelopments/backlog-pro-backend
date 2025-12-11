import { Injectable } from '@nestjs/common';

import { Invoice } from '../../domain/entities/invoice.entity';
import { Amount } from '../../domain/value-objects/amount.vo';
import { InvoiceStatus } from '../../domain/value-objects/invoice-status.vo';
import { InvoiceRepository } from '../../repository/invoice.repository';
import { UpdateInvoiceCommand } from './update-invoice.command';

@Injectable()
export class UpdateInvoiceCommandHandler {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async handle(command: UpdateInvoiceCommand): Promise<Invoice> {
    const invoice = await this.invoiceRepository.getById(command.id);
    
    if (!invoice) {
      throw new Error(`Invoice with id ${command.id} not found`);
    }

    // Create updated invoice with new values
    const updatedInvoice = new Invoice(
      invoice.getInvoiceNumber(),
      invoice.getClientId(),
      command.amount !== undefined ? Amount.create(command.amount) : invoice.getAmount(),
      command.tax !== undefined ? Amount.create(command.tax) : invoice.getTax(),
      invoice.getIssueDate(),
      command.dueDate ?? invoice.getDueDate(),
      command.status !== undefined ? InvoiceStatus.create(command.status) : invoice.getStatus(),
      invoice.getProjectId(),
      invoice.getPaidDate(),
      command.items ?? invoice.getItems(),
      command.notes ?? invoice.getNotes(),
      invoice.getId(),
      invoice.getCreatedAt(),
      new Date(), // updatedAt
      invoice.getDeletedAt()
    );

    return this.invoiceRepository.save(updatedInvoice);
  }
}