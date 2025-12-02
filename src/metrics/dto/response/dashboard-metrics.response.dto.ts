import { ObjectType, Field } from '@nestjs/graphql';
import { ProjectMetricsResponseDto } from './project-metrics.response.dto';

@ObjectType()
export class DashboardMetricsResponseDto {
  @Field()
  timestamp!: Date;

  @Field()
  totalProjects!: number;

  @Field()
  totalBudget!: number;

  @Field()
  totalSpent!: number;

  @Field()
  remainingBudget!: number;

  @Field()
  budgetUtilization!: number;

  @Field()
  totalTasks!: number;

  @Field()
  completedTasks!: number;

  @Field()
  overallProgress!: number;

  @Field(() => [ProjectMetricsResponseDto])
  projects!: ProjectMetricsResponseDto[];
}
