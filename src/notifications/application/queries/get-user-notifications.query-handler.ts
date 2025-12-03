import { Injectable } from '@nestjs/common';

import { NotificationResponseDto } from '../../dto/response/notification.response.dto';
import { NotificationRepository } from '../../repository/notification.repository';

import {
  GetUnreadNotificationsQuery,
  GetUserNotificationsQuery,
} from './get-user-notifications.query';

@Injectable()
export class GetUserNotificationsQueryHandler {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async handle(query: GetUserNotificationsQuery): Promise<NotificationResponseDto[]> {
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

  async handle(query: GetUnreadNotificationsQuery): Promise<NotificationResponseDto[]> {
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
