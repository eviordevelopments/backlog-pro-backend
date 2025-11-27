import { BaseDomainException } from '../../../shared';

export class InvalidCredentialsException extends BaseDomainException {
  constructor() {
    super('AUTH_003', 'Las credenciales proporcionadas son inválidas');
  }
}
