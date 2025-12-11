import { Injectable } from '@nestjs/common';

import { TransactionRepository } from '../../repository/transaction.repository';
import { DeleteTransactionCommand } from './delete-transaction.command';

@Injectable()
export class DeleteTransactionCommandHandler {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async handle(command: DeleteTransactionCommand): Promise<void> {
    const transaction = await this.transactionRepository.getById(command.id);
    
    if (!transaction) {
      throw new Error(`Transaction with id ${command.id} not found`);
    }

    // Soft delete
    transaction.setDeletedAt(new Date());
    await this.transactionRepository.save(transaction);
  }
}