import { BaseDomainException } from '@shared/exceptions';

export class ProjectNotFoundException extends BaseDomainException {
  constructor(projectId: string) {
    super('PROJECT_003', `Proyecto con ID "${projectId}" no encontrado`);
  }
}
