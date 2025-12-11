import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MarkNotificationAsReadCommandHandler } from './application/commands/mark-notification-as-read.command-handler';
import {
    GetUnreadNotificationsQueryHandler,
    GetUserNotificationsQueryHandler,
} from './application/queries/get-user-notifications.query-handler';
import { NotificationTypeOrmEntity } from './repository/entities/notification.typeorm-entity';
import { NotificationMapper } from './repository/mappers/notification.mapper';
import { NotificationRepository } from './repository/notification.repository';
import { NotificationResolver } from './resolvers/notification.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationTypeOrmEntity])],
  providers: [
    NotificationRepository,
    NotificationMapper,
    GetUserNotificationsQueryHandler,
    GetUnreadNotificationsQueryHandler,
    MarkNotificationAsReadCommandHandler,
    NotificationResolver,
  ],
  exports: [NotificationRepository],
})
export class NotificationsModule {}
