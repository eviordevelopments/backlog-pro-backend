import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ProjectMemberResponseDto {
  @Field()
  id!: string;

  @Field()
  projectId!: string;

  @Field()
  userId!: string;

  @Field()
  role!: string;

  @Field()
  joinedAt!: Date;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
