import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignupResponse {
  @Field()
  userId!: string;

  @Field()
  email!: string;

  @Field()
  name!: string;

  @Field()
  message!: string;

  @Field()
  requiresEmailConfirmation!: boolean;
}
