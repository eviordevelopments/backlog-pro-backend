import { Injectable, Logger } from '@nestjs/common';

import { Client } from '../../domain/entities/client.entity';
import { ClientNotFoundException } from '../../domain/exceptions/index';
import { ClientRepository } from '../../repository/client.repository';

import { GetClientProjectsQuery, GetClientQuery, ListClientsQuery } from './index';

@Injectable()
export class GetClientQueryHandler {
  private readonly logger = new Logger(GetClientQueryHandler.name);

  constructor(private readonly clientRepository: ClientRepository) {}

  async handle(query: GetClientQuery): Promise<Client> {
    this.logger.log(`Getting client: ${query.id}`);

    const client = await this.clientRepository.getById(query.id);
    if (!client) {
      throw new ClientNotFoundException(query.id);
    }

    return client;
  }
}

@Injectable()
export class ListClientsQueryHandler {
  private readonly logger = new Logger(ListClientsQueryHandler.name);

  constructor(private readonly clientRepository: ClientRepository) {}

  async handle(_query: ListClientsQuery): Promise<Client[]> {
    this.logger.log('Listing clients');
    return this.clientRepository.list();
  }
}

@Injectable()
export class GetClientProjectsQueryHandler {
  private readonly logger = new Logger(GetClientProjectsQueryHandler.name);

  constructor(private readonly clientRepository: ClientRepository) {}

  async handle(query: GetClientProjectsQuery): Promise<unknown[]> {
    this.logger.log(`Getting projects for client: ${query.clientId}`);

    const client = await this.clientRepository.getById(query.clientId);
    if (!client) {
      throw new ClientNotFoundException(query.clientId);
    }

    // This would typically query the ProjectRepository to get projects for this client
    // For now, returning empty array as placeholder
    return [];
  }
}
