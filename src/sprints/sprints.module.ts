import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompleteSprintCommandHandler } from './application/commands/complete-sprint.command-handler';
import { CreateSprintCommandHandler } from './application/commands/create-sprint.command-handler';
import { DeleteSprintCommandHandler } from './application/commands/delete-sprint.command-handler';
import { ExtendSprintCommandHandler } from './application/commands/extend-sprint.command-handler';
import { RegisterRetrospectiveCommandHandler } from './application/commands/register-retrospective.command-handler';
import { UpdateSprintCommandHandler } from './application/commands/update-sprint.command-handler';
import { GetSprintQueryHandler } from './application/queries/get-sprint.query-handler';
import { ListSprintsProjectQueryHandler } from './application/queries/list-sprints-project.query-handler';
import { SprintService } from './application/services/sprint.service';
import { SprintTypeOrmEntity } from './repository/entities/sprint.typeorm-entity';
import { SprintMapper } from './repository/mappers/sprint.mapper';
import { SprintRepository } from './repository/sprint.repository';
import { SprintResolver } from './resolvers/sprint.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([SprintTypeOrmEntity])],
  providers: [
    SprintMapper,
    SprintRepository,
    CreateSprintCommandHandler,
    UpdateSprintCommandHandler,
    ExtendSprintCommandHandler,
    CompleteSprintCommandHandler,
    DeleteSprintCommandHandler,
    RegisterRetrospectiveCommandHandler,
    GetSprintQueryHandler,
    ListSprintsProjectQueryHandler,
    SprintService,
    SprintResolver,
  ],
  exports: [SprintService, SprintRepository],
})
export class SprintsModule {}
