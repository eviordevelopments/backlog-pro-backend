import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiskTypeOrmEntity } from '@risks/repository/entities/risk.typeorm-entity';
import { RiskRepository } from '@risks/repository/risk.repository';
import { RiskMapper } from '@risks/repository/mappers/risk.mapper';
import { CreateRiskCommandHandler } from '@risks/application/commands/create-risk.command-handler';
import { GetProjectRisksQueryHandler } from '@risks/application/queries/get-project-risks.query-handler';
import { RiskResolver } from '@risks/resolvers/risk.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([RiskTypeOrmEntity])],
  providers: [
    RiskRepository,
    RiskMapper,
    CreateRiskCommandHandler,
    GetProjectRisksQueryHandler,
    RiskResolver,
  ],
  exports: [RiskRepository, CreateRiskCommandHandler],
})
export class RisksModule {}
