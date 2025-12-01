import { IsString, IsNumber, IsDate, IsOptional, IsUUID, IsBoolean } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  type!: string;

  @IsString()
  category!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  currency!: string;

  @IsDate()
  date!: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsString()
  recurringFrequency?: string;
}
