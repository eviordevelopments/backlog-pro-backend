import { Injectable } from '@nestjs/common';
import { ListTransactionsQuery } from './list-transactions.query';
import { TransactionRepository } from '@finances/repository/transaction.repository';

@Injectable()
export class ListTransactionsQueryHandler {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async handle(query: ListTransactionsQuery): Promise<any[]> {
    if (query.filters?.projectId) {
      return (
        await this.transactionRepository.getByProjectId(query.filters.projectId)
      ).map((t) => ({
        id: t.getId(),
        type: t.getType().getValue(),
        category: t.getCategory(),
        amount: t.getAmount().getValue(),
        currency: t.getCurrency().getValue(),
        date: t.getDate(),
        description: t.getDescription(),
      }));
    }

    if (query.filters?.clientId) {
      return (
        await this.transactionRepository.getByClientId(query.filters.clientId)
      ).map((t) => ({
        id: t.getId(),
        type: t.getType().getValue(),
        category: t.getCategory(),
        amount: t.getAmount().getValue(),
        currency: t.getCurrency().getValue(),
        date: t.getDate(),
        description: t.getDescription(),
      }));
    }

    return (await this.transactionRepository.list()).map((t) => ({
      id: t.getId(),
      type: t.getType().getValue(),
      category: t.getCategory(),
      amount: t.getAmount().getValue(),
      currency: t.getCurrency().getValue(),
      date: t.getDate(),
      description: t.getDescription(),
    }));
  }
}
