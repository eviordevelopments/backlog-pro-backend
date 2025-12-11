import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateMeetingDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dateTime?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  agenda?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  participants?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  recurringPattern?: string;
}
