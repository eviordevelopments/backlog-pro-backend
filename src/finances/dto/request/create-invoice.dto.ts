import { IsString, IsNumber, IsDate, IsOptional, IsUUID, IsArray } from 'class-validator';

export interface InvoiceItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export class CreateInvoiceDto {
  @IsString()
  invoiceNumber!: string;

  @IsUUID()
  clientId!: string;

  @IsNumber()
  amount!: number;

  @IsNumber()
  tax!: number;

  @IsDate()
  issueDate!: Date;

  @IsDate()
  dueDate!: Date;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsArray()
  items?: InvoiceItemInput[];

  @IsOptional()
  @IsString()
  notes?: string;
}
