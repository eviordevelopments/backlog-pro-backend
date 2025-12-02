import { Injectable } from '@nestjs/common';
import { Notification } from '@notifications/domain/entities/notification.entity';
import { NotificationTypeOrmEntity } from '@notifications/repository/entities/notification.typeorm-entity';

@Injectable()
export class NotificationMapper {
  toDomain(raw: NotificationTypeOrmEntity): Notification {
    return new Notification(
      raw.userId,
      raw.type,
      raw.title,
      raw.message,
      raw.metadata,
      raw.isRead,
      raw.id,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  toPersistence(notification: Notification): Partial<NotificationTypeOrmEntity> {
    return {
      id: notification.getId(),
      userId: notification.getUserId(),
      type: notification.getType(),
      title: notification.getTitle(),
      message: notification.getMessage(),
      metadata: notification.getMetadata(),
      isRead: notification.isNotificationRead(),
      createdAt: notification.getCreatedAt(),
      updatedAt: notification.getUpdatedAt(),
    };
  }
}
