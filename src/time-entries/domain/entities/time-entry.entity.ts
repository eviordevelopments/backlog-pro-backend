import { v4 as uuid } from 'uuid';

export class TimeEntry {
  private id: string;
  private taskId: string;
  private userId: string;
  private hours: number;
  private date: Date;
  private description: string;
  private createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;

  constructor(
    taskId: string,
    userId: string,
    hours: number,
    date: Date,
    description: string = '',
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    this.id = id || uuid();
    this.taskId = taskId;
    this.userId = userId;
    this.hours = hours;
    this.date = date;
    this.description = description;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.deletedAt = deletedAt || null;
  }

  getId(): string {
    return this.id;
  }

  getTaskId(): string {
    return this.taskId;
  }

  getUserId(): string {
    return this.userId;
  }

  getHours(): number {
    return this.hours;
  }

  getDate(): Date {
    return this.date;
  }

  getDescription(): string {
    return this.description;
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

  setHours(hours: number): void {
    this.hours = hours;
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

  setDeletedAt(date: Date | null): void {
    this.deletedAt = date;
    this.updatedAt = new Date();
  }
}
