import { BaseDomainException } from '../../../shared';

export class UserNotFoundException extends BaseDomainException {
  constructor(email: string) {
    super('AUTH_002', `Usuario con email "${email}" no encontrado`);
  }
}
