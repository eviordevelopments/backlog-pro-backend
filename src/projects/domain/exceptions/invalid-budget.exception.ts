import { BaseDomainException } from '../../../shared';

export class InvalidBudgetException extends BaseDomainException {
  constructor(budget: number) {
    super('PROJECT_001', `El presupuesto no puede ser negativo. Valor: ${budget}`);
  }
}
