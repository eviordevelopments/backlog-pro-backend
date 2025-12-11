import { Injectable } from '@nestjs/common';

import { Meeting } from '../../domain/entities/meeting.entity';
import { MeetingRepository } from '../../repository/meeting.repository';
import { UpdateMeetingCommand } from './update-meeting.command';

@Injectable()
export class UpdateMeetingCommandHandler {
  constructor(private readonly meetingRepository: MeetingRepository) {}

  async handle(command: UpdateMeetingCommand): Promise<Meeting> {
    const meeting = await this.meetingRepository.getById(command.id);

    if (!meeting) {
      throw new Error(`Meeting with id ${command.id} not found`);
    }

    // Create updated meeting with new values
    const updatedMeeting = new Meeting(
      command.title ?? meeting.getTitle(),
      command.type ?? meeting.getType(),
      command.dateTime ?? meeting.getDateTime(),
      command.duration ?? meeting.getDuration(),
      meeting.getOwnerId(),
      command.agenda ?? meeting.getAgenda(),
      command.notes ?? meeting.getNotes(),
      meeting.getProjectId(),
      meeting.getSprintId(),
      command.participants ?? meeting.getParticipants(),
      command.isRecurring ?? meeting.isRecurringMeeting(),
      command.recurringPattern !== undefined
        ? command.recurringPattern
        : meeting.getRecurringPattern(),
      command.status ?? meeting.getStatus(),
      meeting.getAttendance(),
      meeting.getId(),
      meeting.getCreatedAt(),
      new Date(), // updatedAt
      meeting.getDeletedAt(),
    );

    return this.meetingRepository.update(command.id, updatedMeeting);
  }
}
