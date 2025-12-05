import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateUserStoryDto {
  @Field()
  @IsUUID()
  projectId!: string;

  @Field()
  @IsString()
  title!: string;

  @Field()
  @IsString()
  userType!: string;

  @Field()
  @IsString()
  action!: string;

  @Field()
  @IsString()
  benefit!: string;

  @Field()
  @IsString()
  priority!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  sprintId?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  acceptanceCriteria?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  storyPoints?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  definitionOfDone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  impactMetrics?: string;
}
