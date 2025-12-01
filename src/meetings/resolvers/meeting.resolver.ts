import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { CreateMeetingCommandHandler } from '@meetings/application/commands/create-meeting.command-handler';
import { CreateMeetingCommand } from '@meetings/application/commands/create-meeting.command';
import { GetSprintMeetingsQueryHandler } from '@meetings/application/queries/get-sprint-meetings.query-handler';
import { GetSprintMeetingsQuery } from '@meetings/application/queries/get-sprint-meetings.query';
import { MeetingRepository } from '@meetings/repository/meeting.repository';
import { CreateMeetingDto } from '@meetings/dto/request/create-meeting.dto';
import { MeetingResponseDto } from '@meetings/dto/response/meeting.response.dto';

@Resolver('Meeting')
export class MeetingResolver {
  constructor(
    private readonly createMeetingHandler: CreateMeetingCommandHandler,
    private readonly sprintMeetingsHandler: GetSprintMeetingsQueryHandler,
    private readonly meetingRepository: MeetingRepository,
  ) {}

  @Mutation(() => MeetingResponseDto)
  @UseGuards(JwtAuthGuard)
  async createMeeting(
    @Args('input') input: CreateMeetingDto
  ): Promise<MeetingResponseDto> {
    const command = new CreateMeetingCommand(
      input.title,
      input.type,
      input.dateTime,
      input.duration,
      input.ownerId,
      input.agenda,
      input.notes,
      input.projectId,
      input.sprintId,
      input.participants,
      input.isRecurring,
      input.recurringPattern
    );

    const meeting = await this.createMeetingHandler.handle(command);

    return {
      id: meeting.getId(),
      title: meeting.getTitle(),
      type: meeting.getType(),
      projectId: meeting.getProjectId(),
      sprintId: meeting.getSprintId(),
      dateTime: meeting.getDateTime(),
      duration: meeting.getDuration(),
      participants: meeting.getParticipants(),
      ownerId: meeting.getOwnerId(),
      agenda: meeting.getAgenda(),
      notes: meeting.getNotes(),
      isRecurring: meeting.isRecurringMeeting(),
      recurringPattern: meeting.getRecurringPattern(),
      status: meeting.getStatus(),
      attendance: meeting.getAttendance(),
      createdAt: meeting.getCreatedAt(),
      updatedAt: meeting.getUpdatedAt(),
    };
  }

  @Query(() => [MeetingResponseDto])
  @UseGuards(JwtAuthGuard)
  async getSprintMeetings(
    @Args('sprintId') sprintId: string
  ): Promise<MeetingResponseDto[]> {
    const query = new GetSprintMeetingsQuery(sprintId);
    const meetings = await this.sprintMeetingsHandler.handle(query);
    return meetings;
  }
}
