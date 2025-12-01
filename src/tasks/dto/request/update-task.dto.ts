import { IsString, IsOptional, IsNumber, Min, MaxLength, IsArray } from 'class-validator';
import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class UpdateTaskDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'El título de la tarea debe ser un texto' })
  @MaxLength(255, { message: 'El título de la tarea no puede exceder 255 caracteres' })
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'El estado debe ser un texto' })
  status?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'La prioridad debe ser un texto' })
  priority?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Las horas estimadas deben ser un número' })
  @Min(0, { message: 'Las horas estimadas no pueden ser negativas' })
  estimatedHours?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Los puntos de historia deben ser un número' })
  @Min(0, { message: 'Los puntos de historia no pueden ser negativos' })
  storyPoints?: number;

  @Field({ nullable: true })
  @IsOptional()
  dueDate?: Date;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray({ message: 'Las etiquetas deben ser un array' })
  tags?: string[];
}
