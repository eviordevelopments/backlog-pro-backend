import { Injectable } from '@nestjs/common';
import { CreateInvoiceCommand } from './create-invoice.command';
import { Invoice } from '@finances/domain/entities/invoice.entity';
import { Amount } from '@finances/domain/value-objects/amount.vo';
import { InvoiceRepository } from '@finances/repository/invoice.repository';

@Injectable()
export class CreateInvoiceCommandHandler {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async handle(command: CreateInvoiceCommand): Promise<Invoice> {
    const total = command.amount + command.tax;

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
