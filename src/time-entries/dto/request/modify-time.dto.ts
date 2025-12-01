import { IsNumber, Min, Max, IsOptional, IsString } from 'class-validator';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class ModifyTimeDto {
  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.25)
  @Max(24)
  hours?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  date?: Date;
}
