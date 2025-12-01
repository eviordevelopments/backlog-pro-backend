import { IsString, IsDate, IsNumber, IsUUID, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateMeetingDto {
  @IsString()
  title!: string;

  @IsString()
  type!: string;

  @IsDate()
  dateTime!: Date;

  @IsNumber()
  duration!: number;

  @IsUUID()
  ownerId!: string;

  @IsOptional()
  @IsString()
  agenda?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  sprintId?: string;

  @IsOptional()
  @IsArray()
  participants?: string[];

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsString()
  recurringPattern?: string;
}
