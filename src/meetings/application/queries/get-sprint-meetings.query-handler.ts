import { Injectable } from '@nestjs/common';
import { GetSprintMeetingsQuery } from './get-sprint-meetings.query';
import { MeetingRepository } from '@meetings/repository/meeting.repository';

@Injectable()
export class GetSprintMeetingsQueryHandler {
  constructor(private readonly meetingRepository: MeetingRepository) {}

  async handle(query: GetSprintMeetingsQuery): Promise<any[]> {
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
