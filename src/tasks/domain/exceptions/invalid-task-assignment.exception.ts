import { BaseDomainException } from '@shared/exceptions/base-domain.exception';

export class InvalidTaskAssignmentException extends BaseDomainException {
  constructor(userId: string, projectId: string) {
    super(
      'TASK_002',
      `User ${userId} is not a member of project ${projectId}`,
    );
  }
}
