import { BaseDomainException } from '@shared/exceptions/base-domain.exception';

export class InvalidAvatarUrlException extends BaseDomainException {
  constructor(url: string) {
    super('USER_001', `La URL del avatar no es válida: ${url}`);
  }
}
