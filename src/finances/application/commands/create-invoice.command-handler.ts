import { Injectable } from '@nestjs/common';

import { Invoice } from '../../domain/entities/invoice.entity';
import { Amount } from '../../domain/value-objects/amount.vo';
import { InvoiceRepository } from '../../repository/invoice.repository';

import { CreateInvoiceCommand } from './create-invoice.command';

@Injectable()
export class CreateInvoiceCommandHandler {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async handle(command: CreateInvoiceCommand): Promise<Invoice> {
    const invoice = new Invoice(
      command.invoiceNumber,
      command.clientId,
      Amount.create(command.amount),
      Amount.create(command.tax),
      command.issueDate,
      command.dueDate,
      undefined,
      command.projectId,
      undefined,
      command.items,
      command.notes,
    );

    return this.invoiceRepository.create(invoice);
  }
}
