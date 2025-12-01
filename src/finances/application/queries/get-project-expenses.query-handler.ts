import { Injectable } from '@nestjs/common';
import { GetProjectExpensesQuery } from './get-project-expenses.query';
import { TransactionRepository } from '@finances/repository/transaction.repository';

@Injectable()
export class GetProjectExpensesQueryHandler {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async handle(query: GetProjectExpensesQuery): Promise<any> {
    const transactions = await this.transactionRepository.getByProjectId(
      query.projectId
    );

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
          amount: transaction.getAmount().getValue(),
          currency: transaction.getCurrency().getValue(),
          date: transaction.getDate(),
          description: transaction.getDescription(),
        });
        return acc;
      },
      {} as Record<string, any[]>
    );

    return grouped;
  }
}
