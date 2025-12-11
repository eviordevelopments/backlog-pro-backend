import { Injectable } from '@nestjs/common';

import { MeetingRepository } from '../../repository/meeting.repository';
import { DeleteMeetingCommand } from './delete-meeting.command';

@Injectable()
export class DeleteMeetingCommandHandler {
  constructor(private readonly meetingRepository: MeetingRepository) {}

  async handle(command: DeleteMeetingCommand): Promise<void> {
    const meeting = await this.meetingRepository.getById(command.id);
    
    if (!meeting) {
      throw new Error(`Meeting with id ${command.id} not found`);
    }

    // Soft delete
    meeting.setDeletedAt(new Date());
    await this.meetingRepository.save(meeting);
  }
}