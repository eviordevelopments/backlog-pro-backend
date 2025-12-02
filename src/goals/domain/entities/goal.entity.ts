import { v4 as uuid } from 'uuid';

export class Goal {
  private id: string;
  private title: string;
  private description: string;
  private type: string; // 'team', 'individual', 'project'
  private category: string;
  private period: string; // 'weekly', 'monthly', 'quarterly', 'yearly'
  private targetValue: number;
  private currentValue: number;
  private unit: string;
  private ownerId: string;
  private startDate: Date;
  private endDate: Date;
  private status: string; // 'active', 'achieved', 'missed', 'cancelled'
  private createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;

  constructor(
    title: string,
    type: string,
    category: string,
    period: string,
    targetValue: number,
    unit: string,
    ownerId: string,
    startDate: Date,
    endDate: Date,
    description?: string,
    currentValue?: number,
    status?: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    this.id = id || uuid();
    this.title = title;
    this.description = description || '';
    this.type = type;
    this.category = category;
    this.period = period;
    this.targetValue = targetValue;
    this.currentValue = currentValue || 0;
    this.unit = unit;
    this.ownerId = ownerId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status || 'active';
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.deletedAt = deletedAt || null;
  }

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getDescription(): string {
    return this.description;
  }

  getType(): string {
    return this.type;
  }

  getCategory(): string {
    return this.category;
  }

  getPeriod(): string {
    return this.period;
  }

  getTargetValue(): number {
    return this.targetValue;
  }

  getCurrentValue(): number {
    return this.currentValue;
  }

  getUnit(): string {
    return this.unit;
  }

  getOwnerId(): string {
    return this.ownerId;
  }

  getStartDate(): Date {
    return this.startDate;
  }

  getEndDate(): Date {
    return this.endDate;
  }

  getStatus(): string {
    return this.status;
  }

  getProgress(): number {
    if (this.targetValue === 0) return 0;
    return Math.round((this.currentValue / this.targetValue) * 100);
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

  setTitle(title: string): void {
    this.title = title;
    this.updatedAt = new Date();
  }

  setDescription(description: string): void {
    this.description = description;
    this.updatedAt = new Date();
  }

  setCurrentValue(value: number): void {
    this.currentValue = value;
    this.updatedAt = new Date();

    // Auto-update status based on progress
    if (value >= this.targetValue) {
      this.status = 'achieved';
    } else if (new Date() > this.endDate && value < this.targetValue) {
      this.status = 'missed';
    }
  }

  setStatus(status: string): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  setDeletedAt(date: Date | null): void {
    this.deletedAt = date;
    this.updatedAt = new Date();
  }
}
