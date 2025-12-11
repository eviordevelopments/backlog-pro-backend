import { Injectable } from '@nestjs/common';

import { Risk } from '../../domain/entities/risk.entity';
import { RiskRepository } from '../../repository/risk.repository';
import { UpdateRiskCommand } from './update-risk.command';

@Injectable()
export class UpdateRiskCommandHandler {
  constructor(private readonly riskRepository: RiskRepository) {}

  async handle(command: UpdateRiskCommand): Promise<Risk> {
    const risk = await this.riskRepository.getById(command.id);

    if (!risk) {
      throw new Error(`Risk with id ${command.id} not found`);
    }

    // Create updated risk with new values
    const updatedRisk = new Risk(
      risk.getProjectId(),
      command.title ?? risk.getTitle(),
      command.category ?? risk.getCategory(),
      command.probability ?? risk.getProbability(),
      command.impact ?? risk.getImpact(),
      command.responsibleId ?? risk.getResponsibleId(),
      command.description ?? risk.getDescription(),
      command.mitigationStrategy ?? risk.getMitigationStrategy(),
      command.isCore ?? risk.isCorRisk(),
      command.status ?? risk.getStatus(),
      risk.getComments(),
      risk.getId(),
      risk.getCreatedAt(),
      new Date(), // updatedAt
      risk.getDeletedAt(),
    );

    return this.riskRepository.update(command.id, updatedRisk);
  }
}
