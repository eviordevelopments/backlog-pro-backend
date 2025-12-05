import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateGoalCommandHandler } from './application/commands/create-goal.command-handler';
import { UpdateGoalProgressCommandHandler } from './application/commands/update-goal-progress.command-handler';
import { GetUserGoalsQueryHandler } from './application/queries/get-user-goals.query-handler';
import { GoalTypeOrmEntity } from './repository/entities/goal.typeorm-entity';
import { GoalRepository } from './repository/goal.repository';
import { GoalMapper } from './repository/mappers/goal.mapper';
import { GoalResolver } from './resolvers/goal.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([GoalTypeOrmEntity])],
  providers: [
    GoalRepository,
    GoalMapper,
    CreateGoalCommandHandler,
    UpdateGoalProgressCommandHandler,
    GetUserGoalsQueryHandler,
    GoalResolver,
  ],
  exports: [GoalRepository, CreateGoalCommandHandler, UpdateGoalProgressCommandHandler],
})
export class GoalsModule {}
