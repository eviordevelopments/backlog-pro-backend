import { Injectable } from '@nestjs/common';
import { CalculateSalariesQuery } from './calculate-salaries.query';
import { CalculateIdealHourlyRateQueryHandler } from './calculate-ideal-hourly-rate.query-handler';
import { CalculateIdealHourlyRateQuery } from './calculate-ideal-hourly-rate.query';
import { TimeEntryRepository } from '@time-entries/repository/time-entry.repository';
import { UserRepository } from '@auth/repository/user.repository';

@Injectable()
export class CalculateSalariesQueryHandler {
  constructor(
    private readonly timeEntryRepository: TimeEntryRepository,
    private readonly userRepository: UserRepository,
    private readonly idealRateHandler: CalculateIdealHourlyRateQueryHandler,
  ) {}

  async handle(query: CalculateSalariesQuery): Promise<any[]> {
    // Get ideal hourly rate
    const idealRate = await this.idealRateHandler.handle(
      new CalculateIdealHourlyRateQuery(query.projectId)
    );

    // Get all time entries for this project
    const timeEntries = await this.timeEntryRepository.getByProjectId(
      query.projectId
    );

    // Group by user and calculate salary
    const salariesByUser = new Map<string, number>();

    for (const entry of timeEntries) {
      const userId = entry.getUserId();
      const hours = entry.getHours();
      const salary = hours * idealRate;

      if (salariesByUser.has(userId)) {
        salariesByUser.set(userId, salariesByUser.get(userId)! + salary);
      } else {
        salariesByUser.set(userId, salary);
      }
    }

    // Convert to array with user details
    const result = [];
    for (const [userId, salary] of salariesByUser.entries()) {
      const user = await this.userRepository.getById(userId);
      result.push({
        userId,
        userName: user?.name || 'Unknown',
        salary: Math.round(salary * 100) / 100,
        idealHourlyRate: idealRate,
      });
    }

    return result;
  }
}
