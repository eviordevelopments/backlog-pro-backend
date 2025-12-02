import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class PasswordResetResponse {
  @Field()
  resetToken!: string;

  @Field()
  expiresIn!: string;
}
