import { ObjectType, Field } from '@nestjs/graphql';

export interface RiskCommentResponse {
  userId: string;
  comment: string;
  timestamp: Date;
}

@ObjectType()
export class RiskResponseDto {
  @Field()
  id!: string;

  @Field()
  projectId!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  category!: string;

  @Field()
  probability!: string;

  @Field()
  impact!: string;

  @Field()
  severity!: number;

  @Field({ nullable: true })
  mitigationStrategy?: string;

  @Field()
  responsibleId!: string;

  @Field()
  status!: string;

  @Field()
  isCore!: boolean;

  @Field(() => [String], { nullable: true })
  comments!: RiskCommentResponse[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
