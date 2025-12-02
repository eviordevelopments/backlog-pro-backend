import { IsString, IsNumber, IsDate, IsOptional, IsUUID, IsArray } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

export interface InvoiceItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

@InputType()
export class CreateInvoiceDto {
  @Field()
  @IsString()
  invoiceNumber!: string;

  @Field()
  @IsUUID()
  clientId!: string;

  @Field()
  @IsNumber()
  amount!: number;

  @Field()
  @IsNumber()
  tax!: number;

  @Field()
  @IsDate()
  issueDate!: Date;

  @Field()
  @IsDate()
  dueDate!: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  items?: InvoiceItemInput[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
