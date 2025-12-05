import { Injectable, Logger } from '@nestjs/common';

import { TimeEntry } from '../../domain/entities/time-entry.entity';
import { TimeEntryRepository } from '../../repository/time-entry.repository';

import { GetTimeEntriesQuery } from './get-time-entries.query';

@Injectable()
export class GetTimeEntriesQueryHandler {
  private readonly logger = new Logger(GetTimeEntriesQueryHandler.name);

  constructor(private readonly timeEntryRepository: TimeEntryRepository) {}

  async handle(query: GetTimeEntriesQuery): Promise<TimeEntry[]> {
    this.logger.log(`Getting time entries for task: ${query.taskId}`);
    return this.timeEntryRepository.listByTask(query.taskId);
  }
}
