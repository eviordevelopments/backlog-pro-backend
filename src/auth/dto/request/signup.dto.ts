import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SignupInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password!: string;

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name!: string;
}
