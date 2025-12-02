import { ObjectType, Field } from '@nestjs/graphql';

export interface InvoiceItemResponse {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

@ObjectType()
export class InvoiceResponseDto {
  @Field()
  id!: string;

  @Field()
  invoiceNumber!: string;

  @Field()
  clientId!: string;

  @Field({ nullable: true })
  projectId?: string;

  @Field()
  amount!: number;

  @Field()
  tax!: number;

  @Field()
  total!: number;

  @Field()
  status!: string;

  @Field()
  issueDate!: Date;

  @Field()
  dueDate!: Date;

  @Field({ nullable: true })
  paidDate?: Date;

  @Field(() => [String], { nullable: true })
  items?: InvoiceItemResponse[];

  @Field({ nullable: true })
  notes?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
