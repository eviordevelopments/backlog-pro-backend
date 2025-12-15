import { BaseDomainException } from '../../../shared/exceptions/base-domain.exception';

export class InvalidBudgetException extends BaseDomainException {
  constructor(budget: number) {
    super('PROJECT_001', `El presupuesto no puede ser negativo. Valor: ${budget}`);
  }
}
