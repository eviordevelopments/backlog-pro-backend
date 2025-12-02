import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class GoalResponseDto {
  @Field()
  id!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  type!: string;

  @Field()
  category!: string;

  @Field()
  period!: string;

  @Field()
  targetValue!: number;

  @Field()
  currentValue!: number;

  @Field()
  progress!: number;

  @Field()
  unit!: string;

  @Field()
  ownerId!: string;

  @Field()
  startDate!: Date;

  @Field()
  endDate!: Date;

  @Field()
  status!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
