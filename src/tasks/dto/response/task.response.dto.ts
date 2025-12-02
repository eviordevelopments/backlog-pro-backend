import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class TaskResponseDto {
  @Field()
  id!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  projectId!: string;

  @Field({ nullable: true })
  sprintId?: string;

  @Field()
  status!: string;

  @Field()
  priority!: string;

  @Field({ nullable: true })
  assignedTo?: string;

  @Field(() => Float)
  estimatedHours!: number;

  @Field(() => Float)
  actualHours!: number;

  @Field(() => Int)
  storyPoints!: number;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field(() => [String])
  tags!: string[];

  @Field(() => [String])
  dependencies!: string[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
