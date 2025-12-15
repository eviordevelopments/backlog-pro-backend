import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CreateMeetingCommand } from '../application/commands/create-meeting.command';
import { CreateMeetingCommandHandler } from '../application/commands/create-meeting.command-handler';
import { DeleteMeetingCommand } from '../application/commands/delete-meeting.command';
import { DeleteMeetingCommandHandler } from '../application/commands/delete-meeting.command-handler';
import { UpdateMeetingCommand } from '../application/commands/update-meeting.command';
import { UpdateMeetingCommandHandler } from '../application/commands/update-meeting.command-handler';
import { GetSprintMeetingsQuery } from '../application/queries/get-sprint-meetings.query';
import { GetSprintMeetingsQueryHandler } from '../application/queries/get-sprint-meetings.query-handler';
import { CreateMeetingDto } from '../dto/request/create-meeting.dto';
import { UpdateMeetingDto } from '../dto/request/update-meeting.dto';
import { MeetingResponseDto } from '../dto/response/meeting.response.dto';

@Resolver('Meeting')
export class MeetingResolver {
  constructor(
    private readonly createMeetingHandler: CreateMeetingCommandHandler,
    private readonly updateMeetingHandler: UpdateMeetingCommandHandler,
    private readonly deleteMeetingHandler: DeleteMeetingCommandHandler,
    private readonly sprintMeetingsHandler: GetSprintMeetingsQueryHandler,
  ) {}

  @Mutation(() => MeetingResponseDto)
  @UseGuards(JwtAuthGuard)
  async createMeeting(@Args('input') input: CreateMeetingDto): Promise<MeetingResponseDto> {
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
      input.recurringPattern,
    );

    const meeting = await this.createMeetingHandler.handle(command);

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
    };
  }

  @Query(() => [MeetingResponseDto])
  @UseGuards(JwtAuthGuard)
  async getSprintMeetings(@Args('sprintId') sprintId: string): Promise<MeetingResponseDto[]> {
    const query = new GetSprintMeetingsQuery(sprintId);
    const meetings = await this.sprintMeetingsHandler.handle(query);
    return meetings;
  }

  @Mutation(() => MeetingResponseDto)
  @UseGuards(JwtAuthGuard)
  async updateMeeting(
    @Args('id') id: string,
    @Args('input') input: UpdateMeetingDto,
  ): Promise<MeetingResponseDto> {
    const command = new UpdateMeetingCommand(
      id,
      input.title,
      input.type,
      input.dateTime ? new Date(input.dateTime) : undefined,
      input.duration,
      input.agenda,
      input.notes,
      input.participants,
      input.status,
      input.isRecurring,
      input.recurringPattern,
    );

    const meeting = await this.updateMeetingHandler.handle(command);

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
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteMeeting(@Args('id') id: string): Promise<boolean> {
    const command = new DeleteMeetingCommand(id);
    await this.deleteMeetingHandler.handle(command);
    return true;
  }
}
