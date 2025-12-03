import { BaseDomainException } from '../../../shared/exceptions/base-domain.exception';

export class InvalidCurrencyException extends BaseDomainException {
  constructor(currency: string) {
    super('FINANCE_002', `Invalid currency: ${currency}. Supported currencies: USD, EUR, MXN, ARS`);
  }
}
