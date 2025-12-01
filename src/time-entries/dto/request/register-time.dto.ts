import { IsUUID, IsNumber, Min, Max, IsOptional, IsString } from 'class-validator';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class RegisterTimeDto {
  @Field()
  @IsUUID('4', { message: 'El ID de la tarea debe ser un UUID válido' })
  taskId!: string;

  @Field()
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  userId!: string;

  @Field(() => Float)
  @IsNumber({}, { message: 'Las horas deben ser un número' })
  @Min(0.25, { message: 'Las horas deben ser al menos 0.25' })
  @Max(24, { message: 'Las horas no pueden exceder 24' })
  hours!: number;

  @Field()
  date!: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  description?: string;
}
