import { BaseDomainException } from '@shared/exceptions/base-domain.exception';

export class UserProfileNotFoundException extends BaseDomainException {
  constructor(userId: string) {
    super('USER_002', `Perfil de usuario con ID "${userId}" no encontrado`);
  }
}
