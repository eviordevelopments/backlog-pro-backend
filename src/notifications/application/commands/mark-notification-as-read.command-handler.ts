import { Injectable } from '@nestjs/common';

import { Notification } from '../../domain/entities/notification.entity';
import { NotificationRepository } from '../../repository/notification.repository';

import { MarkNotificationAsReadCommand } from './mark-notification-as-read.command';

@Injectable()
export class MarkNotificationAsReadCommandHandler {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async handle(command: MarkNotificationAsReadCommand): Promise<Notification> {
    const notification = await this.notificationRepository.getById(command.notificationId);
    if (!notification) {
      throw new Error(`Notification with id ${command.notificationId} not found`);
    }

    notification.markAsRead();
    return this.notificationRepository.update(command.notificationId, notification);
  }
}
