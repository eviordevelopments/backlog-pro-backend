import { v4 as uuid } from 'uuid';

import type { Amount } from '../value-objects/amount.vo';
import { InvoiceStatus } from '../value-objects/invoice-status.vo';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export class Invoice {
  private id: string;
  private invoiceNumber: string;
  private clientId: string;
  private projectId: string | null;
  private amount: Amount;
  private tax: Amount;
  private total: Amount;
  private status: InvoiceStatus;
  private issueDate: Date;
  private dueDate: Date;
  private paidDate: Date | null;
  private items: InvoiceItem[];
  private notes: string;
  private createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;

  constructor(
    invoiceNumber: string,
    clientId: string,
    amount: Amount,
    tax: Amount,
    issueDate: Date,
    dueDate: Date,
    status?: InvoiceStatus,
    projectId?: string | null,
    paidDate?: Date | null,
    items?: InvoiceItem[],
    notes?: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    this.id = id || uuid();
    this.invoiceNumber = invoiceNumber;
    this.clientId = clientId;
    this.projectId = projectId || null;
    this.amount = amount;
    this.tax = tax;
    this.total = amount.add(tax);
    this.status = status || InvoiceStatus.DRAFT;
    this.issueDate = issueDate;
    this.dueDate = dueDate;
    this.paidDate = paidDate || null;
    this.items = items || [];
    this.notes = notes || '';
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.deletedAt = deletedAt || null;
  }

  getId(): string {
    return this.id;
  }

  getInvoiceNumber(): string {
    return this.invoiceNumber;
  }

  getClientId(): string {
    return this.clientId;
  }

  getProjectId(): string | null {
    return this.projectId;
  }

  getAmount(): Amount {
    return this.amount;
  }

  getTax(): Amount {
    return this.tax;
  }

  getTotal(): Amount {
    return this.total;
  }

  getStatus(): InvoiceStatus {
    return this.status;
  }

  getIssueDate(): Date {
    return this.issueDate;
  }

  getDueDate(): Date {
    return this.dueDate;
  }

  getPaidDate(): Date | null {
    return this.paidDate;
  }

  getItems(): InvoiceItem[] {
    return this.items;
  }

  getNotes(): string {
    return this.notes;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getDeletedAt(): Date | null {
    return this.deletedAt;
  }

  setStatus(status: InvoiceStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  setPaidDate(date: Date | null): void {
    this.paidDate = date;
    if (date) {
      this.status = InvoiceStatus.PAID;
    }
    this.updatedAt = new Date();
  }

  setItems(items: InvoiceItem[]): void {
    this.items = items;
    this.updatedAt = new Date();
  }

  setNotes(notes: string): void {
    this.notes = notes;
    this.updatedAt = new Date();
  }

  addItem(item: InvoiceItem): void {
    this.items.push(item);
    this.updatedAt = new Date();
  }

  setDeletedAt(date: Date | null): void {
    this.deletedAt = date;
    this.updatedAt = new Date();
  }

  calculateTotal(): Amount {
    return this.amount.add(this.tax);
  }
}
