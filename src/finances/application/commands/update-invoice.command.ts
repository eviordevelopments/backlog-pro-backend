import { InvoiceItem } from '../../domain/entities/invoice.entity';

export class UpdateInvoiceCommand {
  constructor(
    public readonly id: string,
    public readonly amount?: number,
    public readonly tax?: number,
    public readonly dueDate?: Date,
    public readonly status?: string,
    public readonly items?: InvoiceItem[],
    public readonly notes?: string,
  ) {}
}
