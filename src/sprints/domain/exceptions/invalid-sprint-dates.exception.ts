import { BaseDomainException } from '@shared/exceptions/base-domain.exception';

export class InvalidSprintDatesException extends BaseDomainException {
  constructor() {
    super(
      'SPRINT_001',
      'La fecha de fin del sprint debe ser posterior a la fecha de inicio',
    );
  }
}
