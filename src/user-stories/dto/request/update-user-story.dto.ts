import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateUserStoryDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  userType?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  action?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  benefit?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  priority?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  sprintId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  assignedTo?: string;

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