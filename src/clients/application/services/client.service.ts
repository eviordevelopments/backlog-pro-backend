import { Injectable } from '@nestjs/common';
import { CreateClientCommandHandler } from '@clients/application/commands/handlers';
import { UpdateClientCommandHandler } from '@clients/application/commands/handlers';
import { DeleteClientCommandHandler } from '@clients/application/commands/handlers';
import { GetClientQueryHandler } from '@clients/application/queries/handlers';
import { ListClientsQueryHandler } from '@clients/application/queries/handlers';

@Injectable()
export class ClientService {
  constructor(
    private readonly createClientHandler: CreateClientCommandHandler,
    private readonly updateClientHandler: UpdateClientCommandHandler,
    private readonly deleteClientHandler: DeleteClientCommandHandler,
    private readonly getClientHandler: GetClientQueryHandler,
    private readonly listClientsHandler: ListClientsQueryHandler,
  ) {}

  async createClient(command: any) {
    return this.createClientHandler.handle(command);
  }

  async updateClient(command: any) {
    return this.updateClientHandler.handle(command);
  }

  async deleteClient(command: any) {
    return this.deleteClientHandler.handle(command);
  }

  async getClient(query: any) {
    return this.getClientHandler.handle(query);
  }

  async listClients(query: any) {
    return this.listClientsHandler.handle(query);
  }
}
