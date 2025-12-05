import { Injectable } from '@nestjs/common';

import { Goal } from '../../domain/entities/goal.entity';
import { GoalRepository } from '../../repository/goal.repository';

import { UpdateGoalProgressCommand } from './update-goal-progress.command';

@Injectable()
export class UpdateGoalProgressCommandHandler {
  constructor(private readonly goalRepository: GoalRepository) {}

  async handle(command: UpdateGoalProgressCommand): Promise<Goal> {
    const goal = await this.goalRepository.getById(command.goalId);
    if (!goal) {
      throw new Error(`Goal with id ${command.goalId} not found`);
    }

    goal.setCurrentValue(command.currentValue);
    return this.goalRepository.update(command.goalId, goal);
  }
}
