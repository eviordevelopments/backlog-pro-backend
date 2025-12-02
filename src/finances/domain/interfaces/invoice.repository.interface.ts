import { Invoice } from '@finances/domain/entities/invoice.entity';

export interface IInvoiceRepository {
  create(invoice: Invoice): Promise<Invoice>;
  update(id: string, invoice: Partial<Invoice>): Promise<Invoice>;
  getById(id: string): Promise<Invoice | null>;
  getByInvoiceNumber(invoiceNumber: string): Promise<Invoice | null>;
  getByClientId(clientId: string): Promise<Invoice[]>;
  getByProjectId(projectId: string): Promise<Invoice[]>;
  list(): Promise<Invoice[]>;
  delete(id: string): Promise<void>;
}
