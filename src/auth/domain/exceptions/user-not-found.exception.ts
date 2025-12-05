import { BaseDomainException } from '../../../shared/exceptions/index';

export class UserNotFoundException extends BaseDomainException {
  constructor(email: string) {
    super('AUTH_002', `Usuario con email "${email}" no encontrado`);
  }
}
