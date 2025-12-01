import { IsString, IsUUID, IsDateString, IsOptional } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateSprintDto {
  @Field()
  @IsString()
  name!: string;

  @Field()
  @IsUUID()
  projectId!: string;

  @Field()
  @IsString()
  goal!: string;

  @Field()
  @IsDateString()
  startDate!: string;

  @Field()
  @IsDateString()
  endDate!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  dailyStandupTime?: string;
}
