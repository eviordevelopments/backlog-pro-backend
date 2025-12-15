import { BaseDomainException } from '../../../shared/exceptions/base-domain.exception';

export class UserNotFoundException extends BaseDomainException {
  constructor(email: string) {
    super('AUTH_002', `Usuario con email "${email}" no encontrado`);
  }
}
