import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateGoalDto {
  @Field()
  @IsString()
  title!: string;

  @Field()
  @IsString()
  type!: string;

  @Field()
  @IsString()
  category!: string;

  @Field()
  @IsString()
  period!: string;

  @Field()
  @IsNumber()
  targetValue!: number;

  @Field()
  @IsString()
  unit!: string;

  @Field()
  @IsUUID()
  ownerId!: string;

  @Field()
  @IsDate()
  startDate!: Date;

  @Field()
  @IsDate()
  endDate!: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}
