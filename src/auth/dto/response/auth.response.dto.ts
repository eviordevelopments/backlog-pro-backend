import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthResponse {
  @Field()
  token!: string;

  @Field()
  userId!: string;

  @Field()
  email!: string;

  @Field()
  name!: string;
}
