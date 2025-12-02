import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DatabaseHealth {
  @Field(() => Boolean)
  connected!: boolean;

  @Field(() => String, { nullable: true })
  type?: string;

  @Field(() => String, { nullable: true })
  database?: string;
}

@ObjectType()
export class HealthCheck {
  @Field(() => String)
  status!: string;

  @Field(() => String)
  timestamp!: string;

  @Field(() => String)
  service!: string;

  @Field(() => DatabaseHealth)
  database!: DatabaseHealth;
}
