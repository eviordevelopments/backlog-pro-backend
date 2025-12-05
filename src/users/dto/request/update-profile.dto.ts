import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

@InputType()
export class UpdateProfileDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  name?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray({ message: 'Las habilidades deben ser un array' })
  @IsString({ each: true, message: 'Cada habilidad debe ser un texto' })
  skills?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'La tarifa horaria debe ser un número' })
  @Min(0, { message: 'La tarifa horaria no puede ser negativa' })
  hourlyRate?: number;
}
