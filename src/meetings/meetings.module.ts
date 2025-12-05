import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateMeetingCommandHandler } from './application/commands/create-meeting.command-handler';
import { GetSprintMeetingsQueryHandler } from './application/queries/get-sprint-meetings.query-handler';
import { MeetingTypeOrmEntity } from './repository/entities/meeting.typeorm-entity';
import { MeetingMapper } from './repository/mappers/meeting.mapper';
import { MeetingRepository } from './repository/meeting.repository';
import { MeetingResolver } from './resolvers/meeting.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingTypeOrmEntity])],
  providers: [
    MeetingRepository,
    MeetingMapper,
    CreateMeetingCommandHandler,
    GetSprintMeetingsQueryHandler,
    MeetingResolver,
  ],
  exports: [MeetingRepository, CreateMeetingCommandHandler],
})
export class MeetingsModule {}
