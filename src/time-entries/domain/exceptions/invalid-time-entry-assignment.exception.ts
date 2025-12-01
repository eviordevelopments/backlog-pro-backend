import { BaseDomainException } from '@shared/exceptions/base-domain.exception';

export class InvalidTimeEntryAssignmentException extends BaseDomainException {
  constructor(userId: string, taskId: string) {
    super(
      'TIME_ENTRY_002',
      `User ${userId} is not assigned to task ${taskId}`,
    );
  }
}
