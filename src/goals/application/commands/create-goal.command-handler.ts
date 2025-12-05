import { Injectable } from '@nestjs/common';

import { Goal } from '../../domain/entities/goal.entity';
import { GoalRepository } from '../../repository/goal.repository';

import { CreateGoalCommand } from './create-goal.command';

@Injectable()
export class CreateGoalCommandHandler {
  constructor(private readonly goalRepository: GoalRepository) {}

  async handle(command: CreateGoalCommand): Promise<Goal> {
    const goal = new Goal(
      command.title,
      command.type,
      command.category,
      command.period,
      command.targetValue,
      command.unit,
      command.ownerId,
      command.startDate,
      command.endDate,
      command.description,
    );

    return this.goalRepository.create(goal);
  }
}
