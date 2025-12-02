import { IsString, IsUUID, IsOptional, IsNumber, Min, MaxLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateProjectDto {
  @Field()
  @IsString({ message: 'El nombre del proyecto debe ser un texto' })
  @MaxLength(255, { message: 'El nombre del proyecto no puede exceder 255 caracteres' })
  name!: string;

  @Field()
  @IsUUID('4', { message: 'El ID del cliente debe ser un UUID válido' })
  clientId!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'El presupuesto debe ser un número' })
  @Min(0, { message: 'El presupuesto no puede ser negativo' })
  budget?: number;
}
