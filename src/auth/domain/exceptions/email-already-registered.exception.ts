import { BaseDomainException } from '../../../shared';

export class EmailAlreadyRegisteredException extends BaseDomainException {
  constructor(email: string) {
    super('AUTH_004', `El email "${email}" ya está registrado`);
  }
}
