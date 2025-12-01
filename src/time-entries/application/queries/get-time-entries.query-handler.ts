import { Injectable, Logger } from '@nestjs/common';
import { GetTimeEntriesQuery } from '@time-entries/application/queries/get-time-entries.query';
import { TimeEntry } from '@time-entries/domain/entities/time-entry.entity';
import { TimeEntryRepository } from '@time-entries/repository/time-entry.repository';

@Injectable()
export class GetTimeEntriesQueryHandler {
  private readonly logger = new Logger(GetTimeEntriesQueryHandler.name);

  constructor(private readonly timeEntryRepository: TimeEntryRepository) {}

  async handle(query: GetTimeEntriesQuery): Promise<TimeEntry[]> {
    this.logger.log(`Getting time entries for task: ${query.taskId}`);
    return this.timeEntryRepository.listByTask(query.taskId);
  }
}
