import { BaseDomainException } from '../../../shared/exceptions/base-domain.exception';

export class InvalidEmailException extends BaseDomainException {
  constructor(email: string) {
    super('AUTH_001', `El email "${email}" no es válido`);
  }
}
