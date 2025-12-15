import { BaseDomainException } from '../../../shared/exceptions/base-domain.exception';

export class InvalidSpentAmountException extends BaseDomainException {
  constructor(amount: number) {
    super('PROJECT_003', `El monto gastado no puede ser negativo. Valor: ${amount}`);
  }
}
