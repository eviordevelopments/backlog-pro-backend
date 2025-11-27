import { IsString, IsUUID, IsOptional, IsNumber, Min, MaxLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateProjectDto {
  @Field()
  @IsString()
  @MaxLength(255)
  name!: string;

  @Field()
  @IsUUID()
  clientId!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;
}
