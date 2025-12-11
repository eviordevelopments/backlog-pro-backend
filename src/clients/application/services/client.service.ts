import { Injectable } from '@nestjs/common';

import {
  CreateClientCommandHandler,
  DeleteClientCommandHandler,
  UpdateClientCommandHandler,
} from '../commands/handlers';
import { CreateClientCommand, DeleteClientCommand, UpdateClientCommand } from '../commands/index';
import { GetClientQueryHandler, ListClientsQueryHandler } from '../queries/handlers';
import { GetClientQuery, ListClientsQuery } from '../queries/index';

@Injectable()
export class ClientService {
  constructor(
    private readonly createClientHandler: CreateClientCommandHandler,
    private readonly updateClientHandler: UpdateClientCommandHandler,
    private readonly deleteClientHandler: DeleteClientCommandHandler,
    private readonly getClientHandler: GetClientQueryHandler,
    private readonly listClientsHandler: ListClientsQueryHandler,
  ) {}

  async createClient(command: CreateClientCommand) {
    return this.createClientHandler.handle(command);
  }

  async updateClient(command: UpdateClientCommand) {
    return this.updateClientHandler.handle(command);
  }

  async deleteClient(command: DeleteClientCommand) {
    return this.deleteClientHandler.handle(command);
  }

  async getClient(query: GetClientQuery) {
    return this.getClientHandler.handle(query);
  }

  async listClients(query: ListClientsQuery) {
    return this.listClientsHandler.handle(query);
  }
}
