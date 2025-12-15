import { BaseDomainException } from '../../../shared/exceptions/base-domain.exception';

export class InvalidCredentialsException extends BaseDomainException {
  constructor() {
    super('AUTH_003', 'Las credenciales proporcionadas son inválidas');
  }
}
