import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

@InputType()
export class CreateFeedbackDto {
  @Field()
  @IsUUID()
  toUserId!: string;

  @Field()
  @IsString()
  type!: string;

  @Field()
  @IsString()
  category!: string;

  @Field()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @Field()
  @IsString()
  comment!: string;

  @Field()
  @IsBoolean()
  isAnonymous!: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  sprintId?: string;
}
