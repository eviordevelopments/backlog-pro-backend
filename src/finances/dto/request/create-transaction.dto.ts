import { IsString, IsNumber, IsDate, IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

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
