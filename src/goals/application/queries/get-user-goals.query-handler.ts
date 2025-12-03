import { Injectable } from '@nestjs/common';

import { GoalResponseDto } from '../../dto/response/goal.response.dto';
import { GoalRepository } from '../../repository/goal.repository';

import { GetUserGoalsQuery } from './get-user-goals.query';

@Injectable()
export class GetUserGoalsQueryHandler {
  constructor(private readonly goalRepository: GoalRepository) {}

  async handle(query: GetUserGoalsQuery): Promise<GoalResponseDto[]> {
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
