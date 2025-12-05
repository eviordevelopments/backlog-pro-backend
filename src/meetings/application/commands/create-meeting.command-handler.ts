import { Injectable } from '@nestjs/common';

import { Meeting } from '../../domain/entities/meeting.entity';
import { MeetingRepository } from '../../repository/meeting.repository';

import { CreateMeetingCommand } from './create-meeting.command';

@Injectable()
export class CreateMeetingCommandHandler {
  constructor(private readonly meetingRepository: MeetingRepository) {}

  async handle(command: CreateMeetingCommand): Promise<Meeting> {
    const meeting = new Meeting(
      command.title,
      command.type,
      command.dateTime,
      command.duration,
      command.ownerId,
      command.agenda,
      command.notes,
      command.projectId,
      command.sprintId,
      command.participants,
      command.isRecurring,
      command.recurringPattern,
    );

    return this.meetingRepository.create(meeting);
  }
}
