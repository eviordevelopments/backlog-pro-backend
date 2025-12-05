import { BaseDomainException } from '../../../shared/exceptions/index';

export class InvalidEmailException extends BaseDomainException {
  constructor(email: string) {
    super('AUTH_001', `El email "${email}" no es válido`);
  }
}
