import type { Notification } from '../entities/notification.entity';

export interface INotificationRepository {
  create(notification: Notification): Promise<Notification>;
  update(id: string, notification: Partial<Notification>): Promise<Notification>;
  getById(id: string): Promise<Notification | null>;
  getByUserId(userId: string): Promise<Notification[]>;
  getUnreadByUserId(userId: string): Promise<Notification[]>;
  list(): Promise<Notification[]>;
  delete(id: string): Promise<void>;
}
