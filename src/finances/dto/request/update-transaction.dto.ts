import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateTransactionDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  currency?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  date?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  recurringFrequency?: string;
}
