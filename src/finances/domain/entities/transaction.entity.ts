import { v4 as uuid } from 'uuid';
import { Amount } from '@finances/domain/value-objects/amount.vo';
import { Currency } from '@finances/domain/value-objects/currency.vo';
import { TransactionType } from '@finances/domain/value-objects/transaction-type.vo';

export class Transaction {
  private id: string;
  private type: TransactionType;
  private category: string;
  private amount: Amount;
  private currency: Currency;
  private date: Date;
  private description: string;
  private clientId: string | null;
  private projectId: string | null;
  private isRecurring: boolean;
  private recurringFrequency: string | null;
  private createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;

  constructor(
    type: TransactionType,
    category: string,
    amount: Amount,
    currency: Currency,
    date: Date,
    description: string = '',
    clientId?: string | null,
    projectId?: string | null,
    isRecurring?: boolean,
    recurringFrequency?: string | null,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    this.id = id || uuid();
    this.type = type;
    this.category = category;
    this.amount = amount;
    this.currency = currency;
    this.date = date;
    this.description = description;
    this.clientId = clientId || null;
    this.projectId = projectId || null;
    this.isRecurring = isRecurring || false;
    this.recurringFrequency = recurringFrequency || null;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.deletedAt = deletedAt || null;
  }

  getId(): string {
    return this.id;
  }

  getType(): TransactionType {
    return this.type;
  }

  getCategory(): string {
    return this.category;
  }

  getAmount(): Amount {
    return this.amount;
  }

  getCurrency(): Currency {
    return this.currency;
  }

  getDate(): Date {
    return this.date;
  }

  getDescription(): string {
    return this.description;
  }

  getClientId(): string | null {
    return this.clientId;
  }

  getProjectId(): string | null {
    return this.projectId;
  }

  isRecurringTransaction(): boolean {
    return this.isRecurring;
  }

  getRecurringFrequency(): string | null {
    return this.recurringFrequency;
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

  setCategory(category: string): void {
    this.category = category;
    this.updatedAt = new Date();
  }

  setAmount(amount: Amount): void {
    this.amount = amount;
    this.updatedAt = new Date();
  }

  setDescription(description: string): void {
    this.description = description;
    this.updatedAt = new Date();
  }

  setDate(date: Date): void {
    this.date = date;
    this.updatedAt = new Date();
  }

  setRecurring(isRecurring: boolean, frequency?: string | null): void {
    this.isRecurring = isRecurring;
    this.recurringFrequency = frequency || null;
    this.updatedAt = new Date();
  }

  setDeletedAt(date: Date | null): void {
    this.deletedAt = date;
    this.updatedAt = new Date();
  }
}
