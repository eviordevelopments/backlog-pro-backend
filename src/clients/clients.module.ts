import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CreateClientCommandHandler,
  DeleteClientCommandHandler,
  UpdateClientCommandHandler,
} from './application/commands/handlers';
import {
  GetClientProjectsQueryHandler,
  GetClientQueryHandler,
  ListClientsQueryHandler,
} from './application/queries/handlers';
import { ClientService } from './application/services/client.service';
import { ClientRepository } from './repository/client.repository';
import { ClientTypeOrmEntity } from './repository/entities/client.typeorm-entity';
import { ClientMapper } from './repository/mappers/client.mapper';
import { ClientResolver } from './resolvers/client.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ClientTypeOrmEntity])],
  providers: [
    ClientMapper,
    ClientRepository,
    CreateClientCommandHandler,
    UpdateClientCommandHandler,
    DeleteClientCommandHandler,
    GetClientQueryHandler,
    ListClientsQueryHandler,
    GetClientProjectsQueryHandler,
    ClientService,
    ClientResolver,
  ],
  exports: [ClientService, ClientRepository],
})
export class ClientsModule {}
