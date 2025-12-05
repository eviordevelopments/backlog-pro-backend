import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateClientDto {
  @Field()
  @IsString()
  @MaxLength(255)
  name!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  company?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  industry?: string;
}
