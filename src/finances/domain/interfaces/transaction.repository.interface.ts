import { Transaction } from '@finances/domain/entities/transaction.entity';

export interface ITransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;
  update(id: string, transaction: Partial<Transaction>): Promise<Transaction>;
  getById(id: string): Promise<Transaction | null>;
  getByProjectId(projectId: string): Promise<Transaction[]>;
  getByClientId(clientId: string): Promise<Transaction[]>;
  list(): Promise<Transaction[]>;
  delete(id: string): Promise<void>;
}
