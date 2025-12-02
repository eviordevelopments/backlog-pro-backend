import { BaseDomainException } from '@shared/exceptions/base-domain.exception';

export class InvalidClientMetricsException extends BaseDomainException {
  constructor(metric: string) {
    super('CLIENT_002', `Invalid client metric: ${metric} must be non-negative`);
  }
}
