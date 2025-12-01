import { IsString, IsUUID, IsOptional, IsNumber, Min, MaxLength, IsArray } from 'class-validator';
import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class CreateTaskDto {
  @Field()
  @IsString()
  @MaxLength(255)
  title!: string;

  @Field()
  @IsUUID()
  projectId!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  sprintId?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedHours?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  storyPoints?: number;

  @Field({ nullable: true })
  @IsOptional()
  dueDate?: Date;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  tags?: string[];
}
