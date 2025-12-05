import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

@InputType()
export class CreateTaskDto {
  @Field()
  @IsString({ message: 'El título de la tarea debe ser un texto' })
  @MaxLength(255, { message: 'El título de la tarea no puede exceder 255 caracteres' })
  title!: string;

  @Field()
  @IsUUID('4', { message: 'El ID del proyecto debe ser un UUID válido' })
  projectId!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del sprint debe ser un UUID válido' })
  sprintId?: string;

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
