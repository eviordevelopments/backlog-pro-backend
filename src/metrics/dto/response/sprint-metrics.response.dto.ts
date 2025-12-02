import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SprintMetricsResponseDto {
  @Field()
  sprintId!: string;

  @Field()
  sprintName!: string;

  @Field()
  status!: string;

  @Field()
  storyPointsCommitted!: number;

  @Field()
  storyPointsCompleted!: number;

  @Field()
  velocity!: number;

  @Field()
  completionRate!: number;

  @Field()
  totalTasks!: number;

  @Field()
  completedTasks!: number;

  @Field()
  averageCycleTime!: number;

  @Field()
  startDate!: Date;

  @Field()
  endDate!: Date;
}
