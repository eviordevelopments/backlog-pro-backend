import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionResponseDto {
  @Field()
  id!: string;

  @Field()
  type!: string;

  @Field()
  category!: string;

  @Field()
  amount!: number;

  @Field()
  currency!: string;

  @Field()
  date!: Date;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  clientId?: string;

  @Field({ nullable: true })
  projectId?: string;

  @Field()
  isRecurring!: boolean;

  @Field({ nullable: true })
  recurringFrequency?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
