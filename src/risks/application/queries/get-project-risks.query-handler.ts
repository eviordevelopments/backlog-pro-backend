import { Injectable } from '@nestjs/common';

import { RiskResponseDto } from '../../dto/response/risk.response.dto';
import { RiskRepository } from '../../repository/risk.repository';

import { GetProjectRisksQuery } from './get-project-risks.query';

@Injectable()
export class GetProjectRisksQueryHandler {
  constructor(private readonly riskRepository: RiskRepository) {}

  async handle(query: GetProjectRisksQuery): Promise<RiskResponseDto[]> {
    const risks = await this.riskRepository.getByProjectId(query.projectId);

    // Sort by severity (impact * probability)
    const sorted = risks.sort((a, b) => b.getSeverity() - a.getSeverity());

    return sorted.map((r) => ({
      id: r.getId(),
      projectId: r.getProjectId(),
      title: r.getTitle(),
      category: r.getCategory(),
      probability: r.getProbability(),
      impact: r.getImpact(),
      severity: r.getSeverity(),
      status: r.getStatus(),
      mitigationStrategy: r.getMitigationStrategy(),
      responsibleId: r.getResponsibleId(),
      isCore: r.isCorRisk(),
      comments: r.getComments(),
      createdAt: r.getCreatedAt(),
      updatedAt: r.getUpdatedAt(),
    }));
  }
}
