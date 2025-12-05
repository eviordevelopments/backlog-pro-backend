import { Injectable } from '@nestjs/common';

import { TimeEntryRepository } from '../../../time-entries/repository/time-entry.repository';

import { GetHoursWorkedQuery } from './get-hours-worked.query';

@Injectable()
export class GetHoursWorkedQueryHandler {
  constructor(private readonly timeEntryRepository: TimeEntryRepository) {}

  async execute(
    query: GetHoursWorkedQuery,
  ): Promise<{ totalHours: number; byProject: Record<string, number> }> {
    const timeEntries = await this.timeEntryRepository.listByUser(query.userId);

    let totalHours = 0;
    const byProject: Record<string, number> = {};

    for (const entry of timeEntries) {
      totalHours += entry.getHours();
      const projectId = entry.getTaskId(); // Assuming taskId maps to project
      byProject[projectId] = (byProject[projectId] || 0) + entry.getHours();
    }

    return { totalHours, byProject };
  }
}
