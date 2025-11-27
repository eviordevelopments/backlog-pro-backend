import { IsString, IsOptional, IsArray, IsNumber, Min, MaxLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateProfileDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;
}
