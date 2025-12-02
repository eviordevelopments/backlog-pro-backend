import { Injectable } from '@nestjs/common';
import { CreateGoalCommand } from './create-goal.command';
import { Goal } from '@goals/domain/entities/goal.entity';
import { GoalRepository } from '@goals/repository/goal.repository';

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
