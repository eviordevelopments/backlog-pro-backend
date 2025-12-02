import { ObjectType, Field } from '@nestjs/graphql';

export interface AcceptanceCriteriaResponse {
  id: string;
  description: string;
  completed: boolean;
}

@ObjectType()
export class UserStoryResponseDto {
  @Field()
  id!: string;

  @Field()
  projectId!: string;

  @Field(() => String, { nullable: true })
  sprintId?: string | null;

  @Field()
  title!: string;

  @Field()
  userType!: string;

  @Field()
  action!: string;

  @Field()
  benefit!: string;

  @Field(() => [String], { nullable: true })
  acceptanceCriteria!: AcceptanceCriteriaResponse[];

  @Field()
  storyPoints!: number;

  @Field()
  priority!: string;

  @Field()
  status!: string;

  @Field(() => String, { nullable: true })
  assignedTo?: string | null;

  @Field({ nullable: true })
  definitionOfDone?: string;

  @Field({ nullable: true })
  impactMetrics?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
