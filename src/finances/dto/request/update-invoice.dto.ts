import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class InvoiceItemInput {
  @Field()
  @IsString()
  description!: string;

  @Field()
  @IsNumber()
  quantity!: number;

  @Field()
  @IsNumber()
  unitPrice!: number;

  @Field()
  @IsNumber()
  total!: number;
}

@InputType()
export class UpdateInvoiceDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  tax?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @Field(() => [InvoiceItemInput], { nullable: true })
  @IsOptional()
  @IsArray()
  items?: InvoiceItemInput[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
