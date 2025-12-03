import { Injectable } from '@nestjs/common';

import { Transaction } from '../../domain/entities/transaction.entity';
import { Amount } from '../../domain/value-objects/amount.vo';
import { Currency } from '../../domain/value-objects/currency.vo';
import { TransactionType } from '../../domain/value-objects/transaction-type.vo';
import { TransactionTypeOrmEntity } from '../entities/transaction.typeorm-entity';

@Injectable()
export class TransactionMapper {
  toDomain(raw: TransactionTypeOrmEntity): Transaction {
    return new Transaction(
      TransactionType.create(raw.type),
      raw.category,
      Amount.create(Number(raw.amount)),
      Currency.create(raw.currency),
      raw.date,
      raw.description || '',
      raw.clientId,
      raw.projectId,
      raw.isRecurring,
      raw.recurringFrequency,
      raw.id,
      raw.createdAt,
      raw.updatedAt,
      raw.deletedAt,
    );
  }

  toPersistence(transaction: Transaction): Partial<TransactionTypeOrmEntity> {
    return {
      id: transaction.getId(),
      type: transaction.getType().getValue(),
      category: transaction.getCategory(),
      amount: transaction.getAmount().getValue(),
      currency: transaction.getCurrency().getValue(),
      date: transaction.getDate(),
      description: transaction.getDescription(),
      clientId: transaction.getClientId() ?? undefined,
      projectId: transaction.getProjectId() ?? undefined,
      isRecurring: transaction.isRecurringTransaction(),
      recurringFrequency: transaction.getRecurringFrequency() ?? undefined,
      createdAt: transaction.getCreatedAt(),
      updatedAt: transaction.getUpdatedAt(),
      deletedAt: transaction.getDeletedAt() ?? undefined,
    };
  }
}
