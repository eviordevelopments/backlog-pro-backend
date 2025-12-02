import { BaseDomainException } from '@shared/exceptions/base-domain.exception';

export class TimeEntryNotFoundException extends BaseDomainException {
  constructor(id: string) {
    super('TIME_ENTRY_001', `Time entry with ID ${id} not found`);
  }
}
