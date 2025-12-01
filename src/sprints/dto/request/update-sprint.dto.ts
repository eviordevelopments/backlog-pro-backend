import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsArray,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateSprintDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  goal?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  velocity?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  storyPointsCommitted?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  storyPointsCompleted?: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  teamMembers?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  dailyStandupTime?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  retrospectiveNotes?: string;
}
