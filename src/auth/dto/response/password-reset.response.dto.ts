import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PasswordResetResponse {
  @Field()
  resetToken!: string;

  @Field()
  expiresIn!: string;
}
