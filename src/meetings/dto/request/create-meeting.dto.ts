import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType()
export class CreateMeetingDto {
  @Field()
  @IsString()
  title!: string;

  @Field()
  @IsString()
  type!: string;

  @Field()
  @IsDate()
  dateTime!: Date;

  @Field()
  @IsNumber()
  duration!: number;

  @Field()
  @IsUUID()
  ownerId!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  agenda?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  sprintId?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  participants?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  recurringPattern?: string;
}
