import { Logger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CreateClientCommand } from '../application/commands/create-client.command';
import { DeleteClientCommand } from '../application/commands/delete-client.command';
import { UpdateClientCommand } from '../application/commands/update-client.command';
import { GetClientQuery } from '../application/queries/get-client.query';
import { ListClientsQuery } from '../application/queries/list-clients.query';
import { ClientService } from '../application/services/client.service';
import { Client } from '../domain/entities/client.entity';
import { CreateClientDto } from '../dto/request/create-client.dto';
import { UpdateClientDto } from '../dto/request/update-client.dto';
import { ClientResponseDto } from '../dto/response/client.response.dto';

@Resolver()
@UseGuards(JwtAuthGuard)
export class ClientResolver {
  private readonly logger = new Logger(ClientResolver.name);

  constructor(private readonly clientService: ClientService) {}

  @Mutation(() => ClientResponseDto, {
    description: 'Crea un nuevo cliente',
  })
  async createClient(@Args('input') input: CreateClientDto): Promise<ClientResponseDto> {
    this.logger.log(`Creating client: ${input.name}`);
    const command = new CreateClientCommand(
      input.name,
      input.email,
      input.phone,
      input.company,
      input.industry,
    );

    const client = await this.clientService.createClient(command);
    return this.mapToResponse(client);
  }

  @Query(() => ClientResponseDto, {
    description: 'Obtiene un cliente por ID',
  })
  async getClient(@Args('clientId') clientId: string): Promise<ClientResponseDto> {
    this.logger.log(`Getting client: ${clientId}`);
    const query = new GetClientQuery(clientId);
    const client = await this.clientService.getClient(query);
    return this.mapToResponse(client);
  }

  @Query(() => [ClientResponseDto], {
    description: 'Lista todos los clientes',
  })
  async listClients(): Promise<ClientResponseDto[]> {
    this.logger.log('Listing clients');
    const query = new ListClientsQuery();
    const clients = await this.clientService.listClients(query);
    return clients.map((c) => this.mapToResponse(c));
  }

  @Mutation(() => ClientResponseDto, {
    description: 'Actualiza un cliente',
  })
  async updateClient(
    @Args('clientId') clientId: string,
    @Args('input') input: UpdateClientDto,
  ): Promise<ClientResponseDto> {
    this.logger.log(`Updating client: ${clientId}`);
    const command = new UpdateClientCommand(
      clientId,
      input.name,
      input.email,
      input.phone,
      input.company,
      input.industry,
      input.ltv,
      input.cac,
      input.mrr,
    );

    const client = await this.clientService.updateClient(command);
    return this.mapToResponse(client);
  }

  @Mutation(() => Boolean, {
    description: 'Elimina un cliente',
  })
  async deleteClient(@Args('clientId') clientId: string): Promise<boolean> {
    this.logger.log(`Deleting client: ${clientId}`);
    const command = new DeleteClientCommand(clientId);
    await this.clientService.deleteClient(command);
    return true;
  }

  private mapToResponse(client: Client): ClientResponseDto {
    return {
      id: client.getId(),
      name: client.getName(),
      email: client.getEmail(),
      phone: client.getPhone(),
      company: client.getCompany(),
      industry: client.getIndustry(),
      status: client.getStatus(),
      ltv: client.getLtv(),
      cac: client.getCac(),
      mrr: client.getMrr(),
      createdAt: client.getCreatedAt(),
      updatedAt: client.getUpdatedAt(),
    };
  }
}
