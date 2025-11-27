import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class UserProfileResponseDto {
  @Field()
  id!: string;

  @Field()
  userId!: string;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field(() => [String], { nullable: true })
  skills?: string[];

  @Field(() => Float, { nullable: true })
  hourlyRate?: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
