import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CreateGoalCommand } from '../application/commands/create-goal.command';
import { CreateGoalCommandHandler } from '../application/commands/create-goal.command-handler';
import { UpdateGoalProgressCommand } from '../application/commands/update-goal-progress.command';
import { UpdateGoalProgressCommandHandler } from '../application/commands/update-goal-progress.command-handler';
import { GetUserGoalsQuery } from '../application/queries/get-user-goals.query';
import { GetUserGoalsQueryHandler } from '../application/queries/get-user-goals.query-handler';
import { CreateGoalDto } from '../dto/request/create-goal.dto';
import { GoalResponseDto } from '../dto/response/goal.response.dto';

@Resolver('Goal')
export class GoalResolver {
  constructor(
    private readonly createGoalHandler: CreateGoalCommandHandler,
    private readonly updateProgressHandler: UpdateGoalProgressCommandHandler,
    private readonly userGoalsHandler: GetUserGoalsQueryHandler,
  ) {}

  @Mutation(() => GoalResponseDto)
  @UseGuards(JwtAuthGuard)
  async createGoal(
    @Args('input', { description: 'Datos del objetivo a crear' }) input: CreateGoalDto,
  ): Promise<GoalResponseDto> {
    const command = new CreateGoalCommand(
      input.title,
      input.type,
      input.category,
      input.period,
      input.targetValue,
      input.unit,
      input.ownerId,
      input.startDate,
      input.endDate,
      input.description,
    );

    const goal = await this.createGoalHandler.handle(command);

    return {
      id: goal.getId(),
      title: goal.getTitle(),
      description: goal.getDescription(),
      type: goal.getType(),
      category: goal.getCategory(),
      period: goal.getPeriod(),
      targetValue: goal.getTargetValue(),
      currentValue: goal.getCurrentValue(),
      progress: goal.getProgress(),
      unit: goal.getUnit(),
      ownerId: goal.getOwnerId(),
      startDate: goal.getStartDate(),
      endDate: goal.getEndDate(),
      status: goal.getStatus(),
      createdAt: goal.getCreatedAt(),
      updatedAt: goal.getUpdatedAt(),
    };
  }

  @Mutation(() => GoalResponseDto)
  @UseGuards(JwtAuthGuard)
  async updateGoalProgress(
    @Args('goalId', { description: 'UUID del objetivo a actualizar' }) goalId: string,
    @Args('currentValue', { description: 'Valor actual alcanzado del objetivo' })
    currentValue: number,
  ): Promise<GoalResponseDto> {
    const command = new UpdateGoalProgressCommand(goalId, currentValue);
    const goal = await this.updateProgressHandler.handle(command);

    return {
      id: goal.getId(),
      title: goal.getTitle(),
      description: goal.getDescription(),
      type: goal.getType(),
      category: goal.getCategory(),
      period: goal.getPeriod(),
      targetValue: goal.getTargetValue(),
      currentValue: goal.getCurrentValue(),
      progress: goal.getProgress(),
      unit: goal.getUnit(),
      ownerId: goal.getOwnerId(),
      startDate: goal.getStartDate(),
      endDate: goal.getEndDate(),
      status: goal.getStatus(),
      createdAt: goal.getCreatedAt(),
      updatedAt: goal.getUpdatedAt(),
    };
  }

  @Query(() => [GoalResponseDto])
  @UseGuards(JwtAuthGuard)
  async getUserGoals(
    @Args('ownerId', { description: 'UUID del propietario de los objetivos' }) ownerId: string,
  ): Promise<GoalResponseDto[]> {
    const query = new GetUserGoalsQuery(ownerId);
    return this.userGoalsHandler.handle(query);
  }
}
