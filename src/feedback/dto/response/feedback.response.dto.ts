import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FeedbackResponseDto {
  @Field()
  id!: string;

  @Field({ nullable: true })
  fromUserId?: string; // null if anonymous

  @Field()
  toUserId!: string;

  @Field()
  type!: string;

  @Field()
  category!: string;

  @Field()
  rating!: number;

  @Field()
  comment!: string;

  @Field(() => String, { nullable: true })
  sprintId?: string | null;

  @Field()
  isAnonymous!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
