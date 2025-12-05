import { BaseDomainException } from '../../../shared/exceptions/base-domain.exception';

export class InvalidAmountException extends BaseDomainException {
  constructor(amount: number) {
    super('FINANCE_001', `Invalid amount: ${amount}. Amount must be non-negative.`);
  }
}
