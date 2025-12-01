import { Injectable } from '@nestjs/common';
import { CalculateIdealHourlyRateQuery } from './calculate-ideal-hourly-rate.query';
import { ProjectRepository } from '@projects/repository/project.repository';
import { TimeEntryRepository } from '@time-entries/repository/time-entry.repository';

@Injectable()
export class CalculateIdealHourlyRateQueryHandler {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly timeEntryRepository: TimeEntryRepository,
  ) {}

  async handle(query: CalculateIdealHourlyRateQuery): Promise<number> {
    const project = await this.projectRepository.getById(query.projectId);
    if (!project) {
      throw new Error(`Project with id ${query.projectId} not found`);
    }

    // Get all time entries for tasks in this project
    const timeEntries = await this.timeEntryRepository.getByProjectId(
      query.projectId
    );

    // Calculate total hours
    const totalHours = timeEntries.reduce((sum, entry) => {
      return sum + entry.getHours();
    }, 0);

    if (totalHours === 0) {
      return 0;
    }

    // Ideal hourly rate = budget / total hours
    const idealRate = project.budget / totalHours;
    return Math.round(idealRate * 100) / 100; // Round to 2 decimals
  }
}
