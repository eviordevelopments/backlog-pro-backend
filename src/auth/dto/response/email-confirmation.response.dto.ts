import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EmailConfirmationResponse {
  @Field()
  success!: boolean;

  @Field()
  message!: string;

  @Field({ nullable: true })
  token?: string;

  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  name?: string;
}
