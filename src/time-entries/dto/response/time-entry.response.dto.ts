import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TimeEntryResponseDto {
  @Field()
  id!: string;

  @Field()
  taskId!: string;

  @Field()
  userId!: string;

  @Field(() => Float)
  hours!: number;

  @Field()
  date!: Date;

  @Field({ nullable: true })
  description?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
