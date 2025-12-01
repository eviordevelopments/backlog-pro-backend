export class TransactionResponseDto {
  id!: string;
  type!: string;
  category!: string;
  amount!: number;
  currency!: string;
  date!: Date;
  description?: string;
  clientId?: string;
  projectId?: string;
  isRecurring!: boolean;
  recurringFrequency?: string;
  createdAt!: Date;
  updatedAt!: Date;
}
