import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

@InputType()
export class UpdateProjectDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'El nombre del proyecto debe ser un texto' })
  @MaxLength(255, { message: 'El nombre del proyecto no puede exceder 255 caracteres' })
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'El presupuesto debe ser un número' })
  @Min(0, { message: 'El presupuesto no puede ser negativo' })
  budget?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'El estado debe ser un texto' })
  status?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'El progreso debe ser un número' })
  @Min(0, { message: 'El progreso no puede ser negativo' })
  progress?: number;
}
