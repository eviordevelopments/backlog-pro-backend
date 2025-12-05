import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class UpdateSprintDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'El nombre del sprint debe ser un texto' })
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'El objetivo del sprint debe ser un texto' })
  goal?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida (ISO 8601)' })
  endDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'El estado debe ser un texto' })
  status?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'La velocidad debe ser un número' })
  @Min(0, { message: 'La velocidad no puede ser negativa' })
  velocity?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Los puntos de historia comprometidos deben ser un número' })
  @Min(0, { message: 'Los puntos de historia comprometidos no pueden ser negativos' })
  storyPointsCommitted?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Los puntos de historia completados deben ser un número' })
  @Min(0, { message: 'Los puntos de historia completados no pueden ser negativos' })
  storyPointsCompleted?: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray({ message: 'Los miembros del equipo deben ser un array' })
  teamMembers?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'La hora del standup diario debe ser un texto' })
  dailyStandupTime?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Las notas de retrospectiva deben ser un texto' })
  retrospectiveNotes?: string;
}
