import { BaseDomainException } from '../../../shared/exceptions/index';

export class EmailAlreadyRegisteredException extends BaseDomainException {
  constructor(email: string) {
    super('AUTH_004', `El email "${email}" ya está registrado`);
  }
}
