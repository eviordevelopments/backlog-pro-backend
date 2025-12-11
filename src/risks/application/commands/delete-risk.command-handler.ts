import { Injectable } from '@nestjs/common';

import { RiskRepository } from '../../repository/risk.repository';
import { DeleteRiskCommand } from './delete-risk.command';

@Injectable()
export class DeleteRiskCommandHandler {
  constructor(private readonly riskRepository: RiskRepository) {}

  async handle(command: DeleteRiskCommand): Promise<void> {
    const risk = await this.riskRepository.getById(command.id);

    if (!risk) {
      throw new Error(`Risk with id ${command.id} not found`);
    }

    // Soft delete
    await this.riskRepository.delete(command.id);
  }
}
