import { BaseDomainException } from '../../../shared/exceptions/base-domain.exception';

export class UserAlreadyMemberException extends BaseDomainException {
  constructor(userId: string, projectId: string) {
    super('PROJECT_004', `El usuario ${userId} ya es miembro del proyecto ${projectId}`);
  }
}
