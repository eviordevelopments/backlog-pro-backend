export interface InvoiceItemResponse {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export class InvoiceResponseDto {
  id!: string;
  invoiceNumber!: string;
  clientId!: string;
  projectId?: string;
  amount!: number;
  tax!: number;
  total!: number;
  status!: string;
  issueDate!: Date;
  dueDate!: Date;
  paidDate?: Date;
  items?: InvoiceItemResponse[];
  notes?: string;
  createdAt!: Date;
  updatedAt!: Date;
}
