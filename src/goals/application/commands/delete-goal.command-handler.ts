import { Injectable } from '@nestjs/common';

import { GoalRepository } from '../../repository/goal.repository';
import { DeleteGoalCommand } from './delete-goal.command';

@Injectable()
export class DeleteGoalCommandHandler {
  constructor(private readonly goalRepository: GoalRepository) {}

  async handle(command: DeleteGoalCommand): Promise<void> {
    const goal = await this.goalRepository.getById(command.id);
    
    if (!goal) {
      throw new Error(`Goal with id ${command.id} not found`);
    }

    // Soft delete
    await this.goalRepository.delete(command.id);
  }
}