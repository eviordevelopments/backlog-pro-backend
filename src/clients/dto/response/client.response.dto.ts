import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class ClientResponseDto {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  company?: string;

  @Field({ nullable: true })
  industry?: string;

  @Field()
  status!: string;

  @Field(() => Float)
  ltv!: number;

  @Field(() => Float)
  cac!: number;

  @Field(() => Float)
  mrr!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
