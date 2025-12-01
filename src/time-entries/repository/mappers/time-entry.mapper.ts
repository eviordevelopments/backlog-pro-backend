import { Injectable } from '@nestjs/common';
import { TimeEntry } from '@time-entries/domain/entities/time-entry.entity';
import { TimeEntryTypeOrmEntity } from '@time-entries/repository/entities/time-entry.typeorm-entity';

@Injectable()
export class TimeEntryMapper {
  toDomain(entity: TimeEntryTypeOrmEntity): TimeEntry {
    return new TimeEntry(
      entity.taskId,
      entity.userId,
      Number(entity.hours),
      entity.date,
      entity.description || '',
      entity.id,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt || null,
    );
  }

  toPersistence(domain: TimeEntry): TimeEntryTypeOrmEntity {
    const entity = new TimeEntryTypeOrmEntity();
    entity.id = domain.getId();
    entity.taskId = domain.getTaskId();
    entity.userId = domain.getUserId();
    entity.hours = domain.getHours();
    entity.date = domain.getDate();
    entity.description = domain.getDescription() || undefined;
    entity.createdAt = domain.getCreatedAt();
    entity.updatedAt = domain.getUpdatedAt();
    entity.deletedAt = domain.getDeletedAt() || undefined;
    return entity;
  }
}
