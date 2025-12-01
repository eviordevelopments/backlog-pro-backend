import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class ProjectResponseDto {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  clientId!: string;

  @Field()
  status!: string;

  @Field({ nullable: true })
  methodology?: string;

  @Field(() => Float)
  budget!: number;

  @Field(() => Float)
  spent!: number;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field(() => Int)
  progress!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
