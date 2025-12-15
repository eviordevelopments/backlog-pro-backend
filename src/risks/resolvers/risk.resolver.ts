import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CreateRiskCommand } from '../application/commands/create-risk.command';
import { CreateRiskCommandHandler } from '../application/commands/create-risk.command-handler';
import { DeleteRiskCommand } from '../application/commands/delete-risk.command';
import { DeleteRiskCommandHandler } from '../application/commands/delete-risk.command-handler';
import { UpdateRiskCommand } from '../application/commands/update-risk.command';
import { UpdateRiskCommandHandler } from '../application/commands/update-risk.command-handler';
import { GetProjectRisksQuery } from '../application/queries/get-project-risks.query';
import { GetProjectRisksQueryHandler } from '../application/queries/get-project-risks.query-handler';
import { CreateRiskDto } from '../dto/request/create-risk.dto';
import { UpdateRiskDto } from '../dto/request/update-risk.dto';
import { RiskResponseDto } from '../dto/response/risk.response.dto';

@Resolver('Risk')
export class RiskResolver {
  constructor(
    private readonly createRiskHandler: CreateRiskCommandHandler,
    private readonly updateRiskHandler: UpdateRiskCommandHandler,
    private readonly deleteRiskHandler: DeleteRiskCommandHandler,
    private readonly projectRisksHandler: GetProjectRisksQueryHandler,
  ) {}

  @Mutation(() => RiskResponseDto)
  @UseGuards(JwtAuthGuard)
  async createRisk(
    @Args('input', { description: 'Datos del riesgo a crear' }) input: CreateRiskDto,
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
      input.isCore,
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
    @Args('projectId', { description: 'UUID del proyecto' }) projectId: string,
  ): Promise<RiskResponseDto[]> {
    const query = new GetProjectRisksQuery(projectId);
    return this.projectRisksHandler.handle(query);
  }

  @Mutation(() => RiskResponseDto)
  @UseGuards(JwtAuthGuard)
  async updateRisk(
    @Args('id', { description: 'UUID del riesgo' }) id: string,
    @Args('input', { description: 'Datos del riesgo a actualizar' }) input: UpdateRiskDto,
  ): Promise<RiskResponseDto> {
    const command = new UpdateRiskCommand(
      id,
      input.title,
      input.description,
      input.category,
      input.probability,
      input.impact,
      input.mitigationStrategy,
      input.responsibleId,
      input.status,
      input.isCore,
    );

    const risk = await this.updateRiskHandler.handle(command);

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

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteRisk(@Args('id', { description: 'UUID del riesgo' }) id: string): Promise<boolean> {
    const command = new DeleteRiskCommand(id);
    await this.deleteRiskHandler.handle(command);
    return true;
  }
}
