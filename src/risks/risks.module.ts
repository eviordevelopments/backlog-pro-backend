import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateRiskCommandHandler } from './application/commands/create-risk.command-handler';
import { DeleteRiskCommandHandler } from './application/commands/delete-risk.command-handler';
import { UpdateRiskCommandHandler } from './application/commands/update-risk.command-handler';
import { GetProjectRisksQueryHandler } from './application/queries/get-project-risks.query-handler';
import { RiskTypeOrmEntity } from './repository/entities/risk.typeorm-entity';
import { RiskMapper } from './repository/mappers/risk.mapper';
import { RiskRepository } from './repository/risk.repository';
import { RiskResolver } from './resolvers/risk.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([RiskTypeOrmEntity])],
  providers: [
    RiskRepository,
    RiskMapper,
    CreateRiskCommandHandler,
    UpdateRiskCommandHandler,
    DeleteRiskCommandHandler,
    GetProjectRisksQueryHandler,
    RiskResolver,
  ],
  exports: [RiskRepository, CreateRiskCommandHandler],
})
export class RisksModule {}
