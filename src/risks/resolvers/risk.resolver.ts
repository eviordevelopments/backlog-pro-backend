import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { CreateRiskCommandHandler } from '@risks/application/commands/create-risk.command-handler';
import { CreateRiskCommand } from '@risks/application/commands/create-risk.command';
import { GetProjectRisksQueryHandler } from '@risks/application/queries/get-project-risks.query-handler';
import { GetProjectRisksQuery } from '@risks/application/queries/get-project-risks.query';
import { RiskRepository } from '@risks/repository/risk.repository';
import { CreateRiskDto } from '@risks/dto/request/create-risk.dto';
import { RiskResponseDto } from '@risks/dto/response/risk.response.dto';

@Resolver('Risk')
export class RiskResolver {
  constructor(
    private readonly createRiskHandler: CreateRiskCommandHandler,
    private readonly projectRisksHandler: GetProjectRisksQueryHandler,
    private readonly riskRepository: RiskRepository,
  ) {}

  @Mutation(() => RiskResponseDto)
  @UseGuards(JwtAuthGuard)
  async createRisk(
    @Args('input', { description: 'Datos del riesgo a crear' }) input: CreateRiskDto
  ): Promise<RiskResponseDto> {
    const command = new CreateRiskCommand(
      input.projectId,
      input.title,
      input.category,
      input.probability,
      input.impact,
      input.responsibleId,
      input.description,
      input.mitigationStrategy,
      input.isCore
    );

    const risk = await this.createRiskHandler.handle(command);

    return {
      id: risk.getId(),
      projectId: risk.getProjectId(),
      title: risk.getTitle(),
      description: risk.getDescription(),
      category: risk.getCategory(),
      probability: risk.getProbability(),
      impact: risk.getImpact(),
      severity: risk.getSeverity(),
      mitigationStrategy: risk.getMitigationStrategy(),
      responsibleId: risk.getResponsibleId(),
      status: risk.getStatus(),
      isCore: risk.isCorRisk(),
      comments: risk.getComments(),
      createdAt: risk.getCreatedAt(),
      updatedAt: risk.getUpdatedAt(),
    };
  }

  @Query(() => [RiskResponseDto])
  @UseGuards(JwtAuthGuard)
  async getProjectRisks(
    @Args('projectId', { description: 'UUID del proyecto' }) projectId: string
  ): Promise<RiskResponseDto[]> {
    const query = new GetProjectRisksQuery(projectId);
    return this.projectRisksHandler.handle(query);
  }
}
