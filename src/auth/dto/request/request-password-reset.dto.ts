import { IsEmail } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RequestPasswordResetInput {
  @Field()
  @IsEmail({}, { message: 'El email no es válido' })
  email!: string;
}
