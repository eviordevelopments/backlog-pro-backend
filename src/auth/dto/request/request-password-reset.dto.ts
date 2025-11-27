import { IsEmail } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RequestPasswordResetInput {
  @Field()
  @IsEmail()
  email!: string;
}
