import { BaseDomainException } from '../../../shared';

export class InvalidAvatarUrlException extends BaseDomainException {
  constructor(url: string) {
    super('USER_001', `La URL del avatar no es válida: ${url}`);
  }
}
