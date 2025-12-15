import { Injectable } from '@nestjs/common';

import { CreateClientCommand } from '../commands/create-client.command';
import { DeleteClientCommand } from '../commands/delete-client.command';
import {
  CreateClientCommandHandler,
  DeleteClientCommandHandler,
  UpdateClientCommandHandler,
} from '../commands/handlers';
import { UpdateClientCommand } from '../commands/update-client.command';
import { GetClientQuery } from '../queries/get-client.query';
import { GetClientQueryHandler, ListClientsQueryHandler } from '../queries/handlers';
import { ListClientsQuery } from '../queries/list-clients.query';

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
