import { Injectable } from '@nestjs/common';
import { GetUserNotificationsQuery, GetUnreadNotificationsQuery } from './get-user-notifications.query';
import { NotificationRepository } from '@notifications/repository/notification.repository';

@Injectable()
export class GetUserNotificationsQueryHandler {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async handle(query: GetUserNotificationsQuery): Promise<any[]> {
    const notifications = await this.notificationRepository.getByUserId(query.userId);

    return notifications.map((n) => ({
      id: n.getId(),
      type: n.getType(),
      title: n.getTitle(),
      message: n.getMessage(),
      metadata: n.getMetadata(),
      isRead: n.isNotificationRead(),
      createdAt: n.getCreatedAt(),
    }));
  }
}

@Injectable()
export class GetUnreadNotificationsQueryHandler {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async handle(query: GetUnreadNotificationsQuery): Promise<any[]> {
    const notifications = await this.notificationRepository.getUnreadByUserId(query.userId);

    return notifications.map((n) => ({
      id: n.getId(),
      type: n.getType(),
      title: n.getTitle(),
      message: n.getMessage(),
      metadata: n.getMetadata(),
      isRead: n.isNotificationRead(),
      createdAt: n.getCreatedAt(),
    }));
  }
}
