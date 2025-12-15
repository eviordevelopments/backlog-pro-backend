import { BaseDomainException } from '../../../shared/exceptions/base-domain.exception';

export class EmailAlreadyRegisteredException extends BaseDomainException {
  constructor(email: string) {
    super('AUTH_004', `El email "${email}" ya está registrado`);
  }
}
