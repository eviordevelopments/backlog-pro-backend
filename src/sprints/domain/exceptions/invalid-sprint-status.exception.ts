import { BaseDomainException } from '../../../shared/exceptions/base-domain.exception';

export class InvalidSprintStatusException extends BaseDomainException {
  constructor(status: string) {
    super('SPRINT_003', `Estado de sprint inválido: ${status}`);
  }
}
