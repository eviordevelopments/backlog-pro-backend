import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ProjectMetricsResponseDto {
  @Field()
  projectId!: string;

  @Field()
  projectName!: string;

  @Field()
  status!: string;

  @Field()
  progress!: number;

  @Field()
  totalTasks!: number;

  @Field()
  completedTasks!: number;

  @Field()
  totalStoryPoints!: number;

  @Field()
  completedStoryPoints!: number;

  @Field()
  budget!: number;

  @Field()
  spent!: number;

  @Field()
  remaining!: number;

  @Field()
  budgetUtilization!: number;

  @Field()
  totalSprints!: number;

  @Field()
  completedSprints!: number;

  @Field()
  averageVelocity!: number;
}
