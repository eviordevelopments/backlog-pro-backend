import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AchievementResponseDto {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field()
  icon!: string;

  @Field()
  category!: string;

  @Field()
  points!: number;

  @Field()
  rarity!: string;

  @Field()
  requirement!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class UserAchievementResponseDto {
  @Field()
  id!: string;

  @Field()
  userId!: string;

  @Field()
  achievementId!: string;

  @Field({ nullable: true })
  achievement?: AchievementResponseDto;

  @Field()
  unlockedAt!: Date;

  @Field()
  createdAt!: Date;
}
