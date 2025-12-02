import { Injectable } from '@nestjs/common';
import { GetProjectRisksQuery } from './get-project-risks.query';
import { RiskRepository } from '@risks/repository/risk.repository';

@Injectable()
export class GetProjectRisksQueryHandler {
  constructor(private readonly riskRepository: RiskRepository) {}

  async handle(query: GetProjectRisksQuery): Promise<any[]> {
    const risks = await this.riskRepository.getByProjectId(query.projectId);

    // Sort by severity (impact * probability)
    const sorted = risks.sort((a, b) => b.getSeverity() - a.getSeverity());

    return sorted.map((r) => ({
      id: r.getId(),
      title: r.getTitle(),
      category: r.getCategory(),
      probability: r.getProbability(),
      impact: r.getImpact(),
      severity: r.getSeverity(),
      status: r.getStatus(),
      mitigationStrategy: r.getMitigationStrategy(),
      isCore: r.isCorRisk(),
      comments: r.getComments(),
    }));
  }
}
