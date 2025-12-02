import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingTypeOrmEntity } from '@meetings/repository/entities/meeting.typeorm-entity';
import { MeetingRepository } from '@meetings/repository/meeting.repository';
import { MeetingMapper } from '@meetings/repository/mappers/meeting.mapper';
import { CreateMeetingCommandHandler } from '@meetings/application/commands/create-meeting.command-handler';
import { GetSprintMeetingsQueryHandler } from '@meetings/application/queries/get-sprint-meetings.query-handler';
import { MeetingResolver } from '@meetings/resolvers/meeting.resolver';

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
