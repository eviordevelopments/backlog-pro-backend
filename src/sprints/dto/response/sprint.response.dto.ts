import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SprintResponseDto {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  projectId!: string;

  @Field()
  goal!: string;

  @Field()
  startDate!: Date;

  @Field()
  endDate!: Date;

  @Field()
  status!: string;

  @Field()
  velocity!: number;

  @Field()
  storyPointsCommitted!: number;

  @Field()
  storyPointsCompleted!: number;

  @Field(() => [String])
  teamMembers!: string[];

  @Field(() => Date, { nullable: true })
  sprintPlanningDate!: Date | null;

  @Field(() => Date, { nullable: true })
  sprintReviewDate!: Date | null;

  @Field(() => Date, { nullable: true })
  sprintRetrospectiveDate!: Date | null;

  @Field()
  dailyStandupTime!: string;

  @Field(() => String, { nullable: true })
  retrospectiveNotes!: string | null;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
