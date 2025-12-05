import { Injectable } from '@nestjs/common';

import { TransactionRepository } from '../../repository/transaction.repository';

import { GetProjectExpensesQuery } from './get-project-expenses.query';

@Injectable()
export class GetProjectExpensesQueryHandler {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async handle(query: GetProjectExpensesQuery): Promise<
    Record<
      string,
      Array<{
        id: string;
        type: string;
        category: string;
        amount: number;
        currency: string;
        date: Date;
        description: string;
        isRecurring: boolean;
        createdAt: Date;
        updatedAt: Date;
      }>
    >
  > {
    const transactions = await this.transactionRepository.getByProjectId(query.projectId);

    // Group by category
    const grouped = transactions.reduce(
      (acc, transaction) => {
        const category = transaction.getCategory();
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push({
          id: transaction.getId(),
          type: transaction.getType().getValue(),
          category: transaction.getCategory(),
          amount: transaction.getAmount().getValue(),
          currency: transaction.getCurrency().getValue(),
          date: transaction.getDate(),
          description: transaction.getDescription(),
          isRecurring: transaction.isRecurringTransaction(),
          createdAt: transaction.getCreatedAt(),
          updatedAt: transaction.getUpdatedAt(),
        });
        return acc;
      },
      {} as Record<
        string,
        Array<{
          id: string;
          type: string;
          category: string;
          amount: number;
          currency: string;
          date: Date;
          description: string;
          isRecurring: boolean;
          createdAt: Date;
          updatedAt: Date;
        }>
      >,
    );

    return grouped;
  }
}
