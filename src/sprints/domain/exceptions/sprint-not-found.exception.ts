import { BaseDomainException } from '@shared/exceptions/base-domain.exception';

export class SprintNotFoundException extends BaseDomainException {
  constructor(id: string) {
    super('SPRINT_002', `Sprint con ID ${id} no encontrado`);
  }
}
