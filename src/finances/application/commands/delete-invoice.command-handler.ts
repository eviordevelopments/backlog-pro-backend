import { Injectable } from '@nestjs/common';

import { InvoiceRepository } from '../../repository/invoice.repository';
import { DeleteInvoiceCommand } from './delete-invoice.command';

@Injectable()
export class DeleteInvoiceCommandHandler {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async handle(command: DeleteInvoiceCommand): Promise<void> {
    const invoice = await this.invoiceRepository.getById(command.id);
    
    if (!invoice) {
      throw new Error(`Invoice with id ${command.id} not found`);
    }

    // Soft delete
    invoice.setDeletedAt(new Date());
    await this.invoiceRepository.save(invoice);
  }
}