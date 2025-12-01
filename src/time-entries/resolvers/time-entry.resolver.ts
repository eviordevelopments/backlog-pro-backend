import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { RegisterTimeDto } from '@time-entries/dto/request/register-time.dto';
import { ModifyTimeDto } from '@time-entries/dto/request/modify-time.dto';
import { TimeEntryResponseDto } from '@time-entries/dto/response/time-entry.response.dto';
import { TimeEntryService } from '@time-entries/application/services/time-entry.service';
import {
  RegisterTimeCommand,
  ModifyTimeCommand,
  DeleteTimeCommand,
} from '@time-entries/application/commands';
import { GetTimeEntriesQuery, GetGroupedTimeEntriesQuery } from '@time-entries/application/queries';
import { TimeEntry } from '@time-entries/domain/entities/time-entry.entity';

@Resolver()
@UseGuards(JwtAuthGuard)
export class TimeEntryResolver {
  private readonly logger = new Logger(TimeEntryResolver.name);

  constructor(private readonly timeEntryService: TimeEntryService) {}

  @Mutation(() => TimeEntryResponseDto, {
    description: 'Registra tiempo trabajado en una tarea',
  })
  async registerTime(@Args('input') input: RegisterTimeDto): Promise<TimeEntryResponseDto> {
    this.logger.log(`Registering time for task: ${input.taskId}`);
    const command = new RegisterTimeCommand(
      input.taskId,
      input.userId,
      input.hours,
      input.date,
      input.description,
    );

    const timeEntry = await this.timeEntryService.registerTime(command);
    return this.mapToResponse(timeEntry);
  }

  @Query(() => [TimeEntryResponseDto], {
    description: 'Obtiene las entradas de tiempo de una tarea',
  })
  async getTimeEntries(@Args('taskId') taskId: string): Promise<TimeEntryResponseDto[]> {
    this.logger.log(`Getting time entries for task: ${taskId}`);
    const query = new GetTimeEntriesQuery(taskId);
    const timeEntries = await this.timeEntryService.getTimeEntries(query);
    return timeEntries.map((te) => this.mapToResponse(te));
  }

  @Query(() => String, {
    description: 'Obtiene las entradas de tiempo agrupadas por proyecto o período',
  })
  async getGroupedTimeEntries(
    @Args('userId') userId: string,
    @Args('groupBy', { nullable: true }) groupBy?: 'project' | 'task' | 'date',
  ): Promise<string> {
    this.logger.log(`Getting grouped time entries for user: ${userId}`);
    const query = new GetGroupedTimeEntriesQuery(userId, groupBy || 'project');
    const grouped = await this.timeEntryService.getGroupedTimeEntries(query);
    return JSON.stringify(grouped);
  }

  @Mutation(() => TimeEntryResponseDto, {
    description: 'Modifica una entrada de tiempo',
  })
  async modifyTime(
    @Args('id') id: string,
    @Args('input') input: ModifyTimeDto,
  ): Promise<TimeEntryResponseDto> {
    this.logger.log(`Modifying time entry: ${id}`);
    const command = new ModifyTimeCommand(id, input.hours, input.description, input.date);

    const timeEntry = await this.timeEntryService.modifyTime(command);
    return this.mapToResponse(timeEntry);
  }

  @Mutation(() => Boolean, {
    description: 'Elimina una entrada de tiempo',
  })
  async deleteTime(@Args('id') id: string): Promise<boolean> {
    this.logger.log(`Deleting time entry: ${id}`);
    const command = new DeleteTimeCommand(id);
    await this.timeEntryService.deleteTime(command);
    return true;
  }

  private mapToResponse(timeEntry: TimeEntry): TimeEntryResponseDto {
    return {
      id: timeEntry.getId(),
      taskId: timeEntry.getTaskId(),
      userId: timeEntry.getUserId(),
      hours: timeEntry.getHours(),
      date: timeEntry.getDate(),
      description: timeEntry.getDescription(),
      createdAt: timeEntry.getCreatedAt(),
      updatedAt: timeEntry.getUpdatedAt(),
    };
  }
}
