import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Client } from '../../domain/entities/client.entity';
import {
  ClientNotFoundException,
  InvalidClientMetricsException,
} from '../../domain/exceptions/index';
import { ClientRepository } from '../../repository/client.repository';

import { CreateClientCommand, DeleteClientCommand, UpdateClientCommand } from './index';

@Injectable()
export class CreateClientCommandHandler {
  private readonly logger = new Logger(CreateClientCommandHandler.name);

  constructor(private readonly clientRepository: ClientRepository) {}

  async handle(command: CreateClientCommand): Promise<Client> {
    this.logger.log(`Creating client: ${command.name}`);

    const client = new Client(
      command.name,
      command.email,
      command.phone,
      command.company,
      command.industry,
      uuidv4(),
    );

    return this.clientRepository.create(client);
  }
}

@Injectable()
export class UpdateClientCommandHandler {
  private readonly logger = new Logger(UpdateClientCommandHandler.name);

  constructor(private readonly clientRepository: ClientRepository) {}

  async handle(command: UpdateClientCommand): Promise<Client> {
    this.logger.log(`Updating client: ${command.id}`);

    const client = await this.clientRepository.getById(command.id);
    if (!client) {
      throw new ClientNotFoundException(command.id);
    }

    if (command.ltv !== undefined && command.ltv < 0) {
      throw new InvalidClientMetricsException('LTV');
    }
    if (command.cac !== undefined && command.cac < 0) {
      throw new InvalidClientMetricsException('CAC');
    }
    if (command.mrr !== undefined && command.mrr < 0) {
      throw new InvalidClientMetricsException('MRR');
    }

    if (command.name) client.setName(command.name);
    if (command.email) client.setEmail(command.email);
    if (command.phone) client.setPhone(command.phone);
    if (command.company) client.setCompany(command.company);
    if (command.industry) client.setIndustry(command.industry);
    if (command.ltv !== undefined) client.setLtv(command.ltv);
    if (command.cac !== undefined) client.setCac(command.cac);
    if (command.mrr !== undefined) client.setMrr(command.mrr);

    return this.clientRepository.update(command.id, client);
  }
}

@Injectable()
export class DeleteClientCommandHandler {
  private readonly logger = new Logger(DeleteClientCommandHandler.name);

  constructor(private readonly clientRepository: ClientRepository) {}

  async handle(command: DeleteClientCommand): Promise<void> {
    this.logger.log(`Deleting client: ${command.id}`);

    const client = await this.clientRepository.getById(command.id);
    if (!client) {
      throw new ClientNotFoundException(command.id);
    }

    // Cascade soft delete: delete client and all associated projects
    await this.clientRepository.deleteWithCascade(command.id);
  }
}
