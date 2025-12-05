import { Injectable } from '@nestjs/common';

import { Risk } from '../../domain/entities/risk.entity';
import { RiskRepository } from '../../repository/risk.repository';

import { CreateRiskCommand } from './create-risk.command';

@Injectable()
export class CreateRiskCommandHandler {
  constructor(private readonly riskRepository: RiskRepository) {}

  async handle(command: CreateRiskCommand): Promise<Risk> {
    const risk = new Risk(
      command.projectId,
      command.title,
      command.category,
      command.probability,
      command.impact,
      command.responsibleId,
      command.description,
      command.mitigationStrategy,
      command.isCore,
    );

    return this.riskRepository.create(risk);
  }
}
