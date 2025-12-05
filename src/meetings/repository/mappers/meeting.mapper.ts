import { Injectable } from '@nestjs/common';

import { Attendee, Meeting } from '../../domain/entities/meeting.entity';
import { MeetingTypeOrmEntity } from '../entities/meeting.typeorm-entity';

@Injectable()
export class MeetingMapper {
  toDomain(raw: MeetingTypeOrmEntity): Meeting {
    return new Meeting(
      raw.title,
      raw.type,
      raw.dateTime,
      raw.duration,
      raw.ownerId,
      raw.agenda || '',
      raw.notes || '',
      raw.projectId,
      raw.sprintId,
      raw.participants || [],
      raw.isRecurring,
      raw.recurringPattern,
      raw.status,
      (raw.attendance as Attendee[]) || [],
      raw.id,
      raw.createdAt,
      raw.updatedAt,
      raw.deletedAt,
    );
  }

  toPersistence(meeting: Meeting): Partial<MeetingTypeOrmEntity> {
    return {
      id: meeting.getId(),
      title: meeting.getTitle(),
      type: meeting.getType(),
      projectId: meeting.getProjectId() ?? undefined,
      sprintId: meeting.getSprintId() ?? undefined,
      dateTime: meeting.getDateTime(),
      duration: meeting.getDuration(),
      participants: meeting.getParticipants(),
      ownerId: meeting.getOwnerId(),
      agenda: meeting.getAgenda(),
      notes: meeting.getNotes(),
      isRecurring: meeting.isRecurringMeeting(),
      recurringPattern: meeting.getRecurringPattern() ?? undefined,
      status: meeting.getStatus(),
      attendance: meeting.getAttendance(),
      createdAt: meeting.getCreatedAt(),
      updatedAt: meeting.getUpdatedAt(),
      deletedAt: meeting.getDeletedAt() ?? undefined,
    };
  }
}
