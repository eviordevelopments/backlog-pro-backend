import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientTypeOrmEntity } from '@clients/repository/entities/client.typeorm-entity';
import { ClientRepository } from '@clients/repository/client.repository';
import { ClientMapper } from '@clients/repository/mappers/client.mapper';
import { CreateClientCommandHandler, UpdateClientCommandHandler, DeleteClientCommandHandler } from '@clients/application/commands/handlers';
import { GetClientQueryHandler, ListClientsQueryHandler, GetClientProjectsQueryHandler } from '@clients/application/queries/handlers';
import { ClientService } from '@clients/application/services/client.service';
import { ClientResolver } from '@clients/resolvers/client.resolver';

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
