import { IsUUID, IsNumber, Min, Max, IsOptional, IsString } from 'class-validator';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class RegisterTimeDto {
  @Field()
  @IsUUID()
  taskId!: string;

  @Field()
  @IsUUID()
  userId!: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0.25)
  @Max(24)
  hours!: number;

  @Field()
  date!: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}
