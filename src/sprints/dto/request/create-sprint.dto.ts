import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateSprintDto {
  @Field()
  @IsString({ message: 'El nombre del sprint debe ser un texto' })
  name!: string;

  @Field()
  @IsUUID('4', { message: 'El ID del proyecto debe ser un UUID válido' })
  projectId!: string;

  @Field()
  @IsString({ message: 'El objetivo del sprint debe ser un texto' })
  goal!: string;

  @Field()
  @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida (ISO 8601)' })
  startDate!: string;

  @Field()
  @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida (ISO 8601)' })
  endDate!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'La hora del standup diario debe ser un texto' })
  dailyStandupTime?: string;
}
