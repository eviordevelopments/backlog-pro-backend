import { BaseDomainException } from '../../../shared/exceptions/base-domain.exception';

export class InvalidProjectStatusException extends BaseDomainException {
  constructor(status: string) {
    super(
      'PROJECT_002',
      `El estado del proyecto "${status}" no es válido. Estados válidos: planning, active, on_hold, completed, archived`,
    );
  }
}
