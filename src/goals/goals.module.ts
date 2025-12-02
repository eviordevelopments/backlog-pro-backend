import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalTypeOrmEntity } from '@goals/repository/entities/goal.typeorm-entity';
import { GoalRepository } from '@goals/repository/goal.repository';
import { GoalMapper } from '@goals/repository/mappers/goal.mapper';
import { CreateGoalCommandHandler } from '@goals/application/commands/create-goal.command-handler';
import { UpdateGoalProgressCommandHandler } from '@goals/application/commands/update-goal-progress.command-handler';
import { GetUserGoalsQueryHandler } from '@goals/application/queries/get-user-goals.query-handler';
import { GoalResolver } from '@goals/resolvers/goal.resolver';

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
