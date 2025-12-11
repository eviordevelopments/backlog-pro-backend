import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';

import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { MarkNotificationAsReadCommand } from '../application/commands/mark-notification-as-read.command';
import { MarkNotificationAsReadCommandHandler } from '../application/commands/mark-notification-as-read.command-handler';
import {
    GetUnreadNotificationsQuery,
    GetUserNotificationsQuery,
} from '../application/queries/get-user-notifications.query';
import {
    GetUnreadNotificationsQueryHandler,
    GetUserNotificationsQueryHandler,
} from '../application/queries/get-user-notifications.query-handler';
import { NotificationResponseDto } from '../dto/response/notification.response.dto';

@Resolver('Notification')
export class NotificationResolver {
  constructor(
    private readonly getUserNotificationsHandler: GetUserNotificationsQueryHandler,
    private readonly getUnreadNotificationsHandler: GetUnreadNotificationsQueryHandler,
    private readonly markAsReadHandler: MarkNotificationAsReadCommandHandler,
  ) {}

  @Query(() => [NotificationResponseDto])
  @UseGuards(JwtAuthGuard)
  async getUserNotifications(
    @CurrentUser() currentUser: { sub: string; email: string },
  ): Promise<NotificationResponseDto[]> {
    const query = new GetUserNotificationsQuery(currentUser.sub);
    return this.getUserNotificationsHandler.handle(query);
  }

  @Query(() => [NotificationResponseDto])
  @UseGuards(JwtAuthGuard)
  async getUnreadNotifications(
    @CurrentUser() currentUser: { sub: string; email: string },
  ): Promise<NotificationResponseDto[]> {
    const query = new GetUnreadNotificationsQuery(currentUser.sub);
    return this.getUnreadNotificationsHandler.handle(query);
  }

  @Mutation(() => NotificationResponseDto)
  @UseGuards(JwtAuthGuard)
  async markNotificationAsRead(
    @Args('notificationId') notificationId: string,
  ): Promise<NotificationResponseDto> {
    const command = new MarkNotificationAsReadCommand(notificationId);
    const notification = await this.markAsReadHandler.handle(command);

    const dto = {
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

    return plainToInstance(NotificationResponseDto, dto, {
      excludeExtraneousValues: false,
    });
  }
}
