import { BaseDomainException } from '../../../shared/exceptions/index';

export class UserAlreadyMemberException extends BaseDomainException {
  constructor(userId: string, projectId: string) {
    super('PROJECT_004', `El usuario ${userId} ya es miembro del proyecto ${projectId}`);
  }
}
