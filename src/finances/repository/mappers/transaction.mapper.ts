import { Injectable } from '@nestjs/common';
import { Transaction } from '@finances/domain/entities/transaction.entity';
import { TransactionTypeOrmEntity } from '@finances/repository/entities/transaction.typeorm-entity';
import { Amount } from '@finances/domain/value-objects/amount.vo';
import { Currency } from '@finances/domain/value-objects/currency.vo';
import { TransactionType } from '@finances/domain/value-objects/transaction-type.vo';

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
      clientId: transaction.getClientId(),
      projectId: transaction.getProjectId(),
      isRecurring: transaction.isRecurringTransaction(),
      recurringFrequency: transaction.getRecurringFrequency(),
      createdAt: transaction.getCreatedAt(),
      updatedAt: transaction.getUpdatedAt(),
      deletedAt: transaction.getDeletedAt(),
    };
  }
}
