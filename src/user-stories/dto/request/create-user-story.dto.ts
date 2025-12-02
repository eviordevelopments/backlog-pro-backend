import { IsString, IsUUID, IsOptional, IsNumber, IsArray } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

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
