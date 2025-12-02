import { BaseDomainException } from '@shared/exceptions/base-domain.exception';

export class TaskNotFoundException extends BaseDomainException {
  constructor(id: string) {
    super('TASK_001', `Task with ID ${id} not found`);
  }
}
