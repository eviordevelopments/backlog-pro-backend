import { Injectable } from '@nestjs/common';

import { ProjectRepository } from '../../../projects/repository/project.repository';
import { Transaction } from '../../domain/entities/transaction.entity';
import { Amount } from '../../domain/value-objects/amount.vo';
import { Currency } from '../../domain/value-objects/currency.vo';
import { TransactionType } from '../../domain/value-objects/transaction-type.vo';
import { TransactionRepository } from '../../repository/transaction.repository';

import { CreateTransactionCommand } from './create-transaction.command';

@Injectable()
export class CreateTransactionCommandHandler {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async handle(command: CreateTransactionCommand): Promise<Transaction> {
    const transaction = new Transaction(
      TransactionType.create(command.type),
      command.category,
      Amount.create(command.amount),
      Currency.create(command.currency),
      command.date,
      command.description,
      command.clientId,
      command.projectId,
      command.isRecurring,
      command.recurringFrequency,
    );

    const created = await this.transactionRepository.create(transaction);

    // Update project spent amount if projectId is provided
    if (command.projectId) {
      const project = await this.projectRepository.getById(command.projectId);
      if (project) {
        project.addSpent(command.amount);
        await this.projectRepository.update(command.projectId, project);
      }
    }

    return created;
  }
}
