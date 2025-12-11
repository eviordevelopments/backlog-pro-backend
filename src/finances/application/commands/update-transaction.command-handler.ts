import { Injectable } from '@nestjs/common';

import { Transaction } from '../../domain/entities/transaction.entity';
import { Amount } from '../../domain/value-objects/amount.vo';
import { Currency } from '../../domain/value-objects/currency.vo';
import { TransactionRepository } from '../../repository/transaction.repository';
import { UpdateTransactionCommand } from './update-transaction.command';

@Injectable()
export class UpdateTransactionCommandHandler {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async handle(command: UpdateTransactionCommand): Promise<Transaction> {
    const transaction = await this.transactionRepository.getById(command.id);
    
    if (!transaction) {
      throw new Error(`Transaction with id ${command.id} not found`);
    }

    // Create updated transaction with new values
    const updatedTransaction = new Transaction(
      transaction.getType(),
      command.category ?? transaction.getCategory(),
      command.amount !== undefined ? Amount.create(command.amount) : transaction.getAmount(),
      command.currency !== undefined ? Currency.create(command.currency) : transaction.getCurrency(),
      command.date ?? transaction.getDate(),
      command.description ?? transaction.getDescription(),
      transaction.getClientId(),
      transaction.getProjectId(),
      command.isRecurring ?? transaction.isRecurringTransaction(),
      command.recurringFrequency !== undefined ? command.recurringFrequency : transaction.getRecurringFrequency(),
      transaction.getId(),
      transaction.getCreatedAt(),
      new Date(), // updatedAt
      transaction.getDeletedAt()
    );

    return this.transactionRepository.save(updatedTransaction);
  }
}