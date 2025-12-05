import { Field, Float, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

@InputType()
export class ModifyTimeDto {
  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Las horas deben ser un número' })
  @Min(0.25, { message: 'Las horas deben ser al menos 0.25' })
  @Max(24, { message: 'Las horas no pueden exceder 24' })
  hours?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  date?: Date;
}
