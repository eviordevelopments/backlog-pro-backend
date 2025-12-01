import { Injectable, Logger } from '@nestjs/common';
import { GetGroupedTimeEntriesQuery } from '@time-entries/application/queries/get-grouped-time-entries.query';
import { TimeEntry } from '@time-entries/domain/entities/time-entry.entity';
import { TimeEntryRepository } from '@time-entries/repository/time-entry.repository';

@Injectable()
export class GetGroupedTimeEntriesQueryHandler {
  private readonly logger = new Logger(GetGroupedTimeEntriesQueryHandler.name);

  constructor(private readonly timeEntryRepository: TimeEntryRepository) {}

  async handle(query: GetGroupedTimeEntriesQuery): Promise<any> {
    this.logger.log(
      `Getting grouped time entries for user: ${query.userId}, grouped by: ${query.groupBy}`,
    );

    const timeEntries = await this.timeEntryRepository.listByUser(query.userId);

    if (query.groupBy === 'date') {
      return this.groupByDate(timeEntries);
    } else if (query.groupBy === 'task') {
      return this.groupByTask(timeEntries);
    } else {
      return this.groupByProject(timeEntries);
    }
  }

  private groupByDate(entries: TimeEntry[]): any {
    const grouped: { [key: string]: TimeEntry[] } = {};
    entries.forEach((entry) => {
      const dateKey = entry.getDate().toISOString().split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(entry);
    });
    return grouped;
  }

  private groupByTask(entries: TimeEntry[]): any {
    const grouped: { [key: string]: TimeEntry[] } = {};
    entries.forEach((entry) => {
      const taskId = entry.getTaskId();
      if (!grouped[taskId]) {
        grouped[taskId] = [];
      }
      grouped[taskId].push(entry);
    });
    return grouped;
  }

  private groupByProject(entries: TimeEntry[]): any {
    // This would require joining with tasks to get project info
    // For now, we'll group by task and return the structure
    return this.groupByTask(entries);
  }
}
