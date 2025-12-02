export interface InvoiceItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export class CreateInvoiceCommand {
  constructor(
    public readonly invoiceNumber: string,
    public readonly clientId: string,
    public readonly amount: number,
    public readonly tax: number,
    public readonly issueDate: Date,
    public readonly dueDate: Date,
    public readonly projectId?: string,
    public readonly items?: InvoiceItemInput[],
    public readonly notes?: string,
  ) {}
}
