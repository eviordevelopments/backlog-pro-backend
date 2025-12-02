import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '@notifications/domain/entities/notification.entity';
import { NotificationTypeOrmEntity } from '@notifications/repository/entities/notification.typeorm-entity';
import { NotificationMapper } from '@notifications/repository/mappers/notification.mapper';
import { INotificationRepository } from '@notifications/domain/interfaces/notification.repository.interface';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(NotificationTypeOrmEntity)
    private readonly repository: Repository<NotificationTypeOrmEntity>,
    private readonly mapper: NotificationMapper,
  ) {}

  async create(notification: Notification): Promise<Notification> {
    const entity = this.repository.create(this.mapper.toPersistence(notification));
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async update(id: string, notification: Partial<Notification>): Promise<Notification> {
    await this.repository.update(id, this.mapper.toPersistence(notification as Notification));
    const updated = await this.repository.findOneBy({ id });
    if (!updated) {
      throw new Error(`Notification with id ${id} not found`);
    }
    return this.mapper.toDomain(updated);
  }

  async getById(id: string): Promise<Notification | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async getByUserId(userId: string): Promise<Notification[]> {
    const entities = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async getUnreadByUserId(userId: string): Promise<Notification[]> {
    const entities = await this.repository.find({
      where: { userId, isRead: false },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async list(): Promise<Notification[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
