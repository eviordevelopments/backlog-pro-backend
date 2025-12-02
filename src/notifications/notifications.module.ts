import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationTypeOrmEntity } from '@notifications/repository/entities/notification.typeorm-entity';
import { NotificationRepository } from '@notifications/repository/notification.repository';
import { NotificationMapper } from '@notifications/repository/mappers/notification.mapper';
import { GetUserNotificationsQueryHandler, GetUnreadNotificationsQueryHandler } from '@notifications/application/queries/get-user-notifications.query-handler';
import { MarkNotificationAsReadCommandHandler } from '@notifications/application/commands/mark-notification-as-read.command-handler';
import { NotificationResolver } from '@notifications/resolvers/notification.resolver';

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
