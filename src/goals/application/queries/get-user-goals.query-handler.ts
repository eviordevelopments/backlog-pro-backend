import { Injectable } from '@nestjs/common';
import { GetUserGoalsQuery } from './get-user-goals.query';
import { GoalRepository } from '@goals/repository/goal.repository';

@Injectable()
export class GetUserGoalsQueryHandler {
  constructor(private readonly goalRepository: GoalRepository) {}

  async handle(query: GetUserGoalsQuery): Promise<any[]> {
    const goals = await this.goalRepository.getByOwnerId(query.ownerId);
    return goals.map((g) => ({
      id: g.getId(),
      title: g.getTitle(),
      type: g.getType(),
      category: g.getCategory(),
      targetValue: g.getTargetValue(),
      currentValue: g.getCurrentValue(),
      progress: g.getProgress(),
      unit: g.getUnit(),
      status: g.getStatus(),
      startDate: g.getStartDate(),
      endDate: g.getEndDate(),
    }));
  }
}
