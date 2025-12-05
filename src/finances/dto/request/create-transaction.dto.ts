import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateTransactionDto {
  @Field()
  @IsString()
  type!: string;

  @Field()
  @IsString()
  category!: string;

  @Field()
  @IsNumber()
  amount!: number;

  @Field()
  @IsString()
  currency!: string;

  @Field()
  @IsDate()
  date!: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  recurringFrequency?: string;
}
