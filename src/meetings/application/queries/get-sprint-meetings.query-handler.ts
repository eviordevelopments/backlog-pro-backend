import { Injectable } from '@nestjs/common';

import { MeetingResponseDto } from '../../dto/response/meeting.response.dto';
import { MeetingRepository } from '../../repository/meeting.repository';

import { GetSprintMeetingsQuery } from './get-sprint-meetings.query';

@Injectable()
export class GetSprintMeetingsQueryHandler {
  constructor(private readonly meetingRepository: MeetingRepository) {}

  async handle(query: GetSprintMeetingsQuery): Promise<MeetingResponseDto[]> {
    const meetings = await this.meetingRepository.getBySprintId(query.sprintId);
    return meetings.map((m) => ({
      id: m.getId(),
      title: m.getTitle(),
      type: m.getType(),
      dateTime: m.getDateTime(),
      duration: m.getDuration(),
      participants: m.getParticipants(),
      ownerId: m.getOwnerId(),
      status: m.getStatus(),
      attendance: m.getAttendance(),
    }));
  }
}
