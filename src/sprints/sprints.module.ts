import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintTypeOrmEntity } from '@sprints/repository/entities/sprint.typeorm-entity';
import { SprintRepository } from '@sprints/repository/sprint.repository';
import { SprintMapper } from '@sprints/repository/mappers/sprint.mapper';
import { CreateSprintCommandHandler } from '@sprints/application/commands/create-sprint.command-handler';
import { UpdateSprintCommandHandler } from '@sprints/application/commands/update-sprint.command-handler';
import { ExtendSprintCommandHandler } from '@sprints/application/commands/extend-sprint.command-handler';
import { CompleteSprintCommandHandler } from '@sprints/application/commands/complete-sprint.command-handler';
import { RegisterRetrospectiveCommandHandler } from '@sprints/application/commands/register-retrospective.command-handler';
import { GetSprintQueryHandler } from '@sprints/application/queries/get-sprint.query-handler';
import { ListSprintsProjectQueryHandler } from '@sprints/application/queries/list-sprints-project.query-handler';
import { SprintService } from '@sprints/application/services/sprint.service';
import { SprintResolver } from '@sprints/resolvers/sprint.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([SprintTypeOrmEntity])],
  providers: [
    SprintMapper,
    SprintRepository,
    CreateSprintCommandHandler,
    UpdateSprintCommandHandler,
    ExtendSprintCommandHandler,
    CompleteSprintCommandHandler,
    RegisterRetrospectiveCommandHandler,
    GetSprintQueryHandler,
    ListSprintsProjectQueryHandler,
    SprintService,
    SprintResolver,
  ],
  exports: [SprintService, SprintRepository],
})
export class SprintsModule {}
