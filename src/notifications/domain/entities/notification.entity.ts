import { v4 as uuid } from 'uuid';

export class Notification {
  private id: string;
  private userId: string;
  private type: string; // 'task_assigned', 'task_updated', 'mention', 'deadline', 'sprint_started', 'sprint_ended'
  private title: string;
  private message: string;
  private metadata: Record<string, unknown>;
  private isRead: boolean;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    userId: string,
    type: string,
    title: string,
    message: string,
    metadata?: Record<string, unknown>,
    isRead?: boolean,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id || uuid();
    this.userId = userId;
    this.type = type;
    this.title = title;
    this.message = message;
    this.metadata = metadata || {};
    this.isRead = isRead || false;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getType(): string {
    return this.type;
  }

  getTitle(): string {
    return this.title;
  }

  getMessage(): string {
    return this.message;
  }

  getMetadata(): Record<string, unknown> {
    return this.metadata;
  }

  isNotificationRead(): boolean {
    return this.isRead;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  markAsRead(): void {
    this.isRead = true;
    this.updatedAt = new Date();
  }

  markAsUnread(): void {
    this.isRead = false;
    this.updatedAt = new Date();
  }
}
