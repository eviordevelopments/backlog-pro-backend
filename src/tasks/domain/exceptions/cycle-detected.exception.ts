import { BaseDomainException } from '../../../shared/exceptions/base-domain.exception';

export class CycleDetectedException extends BaseDomainException {
  constructor() {
    super('TASK_003', 'Cycle detected in task dependencies');
  }
}
