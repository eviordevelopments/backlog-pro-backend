import type { Client } from '../entities/client.entity';

export interface IClientRepository {
  create(client: Client): Promise<Client>;
  update(id: string, client: Partial<Client>): Promise<Client>;
  getById(id: string): Promise<Client | null>;
  list(): Promise<Client[]>;
  delete(id: string): Promise<void>;
  deleteWithCascade(id: string): Promise<void>;
}
