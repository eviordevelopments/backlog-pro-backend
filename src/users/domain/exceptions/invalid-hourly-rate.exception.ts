import { BaseDomainException } from '../../../shared/exceptions/base-domain.exception';

export class InvalidHourlyRateException extends BaseDomainException {
  constructor(rate: number) {
    super('USER_001', `La tarifa horaria "${rate}" no es válida. Debe ser un número positivo`);
  }
}
