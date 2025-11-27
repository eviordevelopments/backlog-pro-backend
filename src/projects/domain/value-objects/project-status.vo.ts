import { InvalidProjectStatusException } from '../exceptions/invalid-project-status.exception';

export class ProjectStatus {
  private constructor(private readonly value: string) {}

  static readonly PLANNING = new ProjectStatus('planning');
  static readonly ACTIVE = new ProjectStatus('active');
  static readonly ON_HOLD = new ProjectStatus('on_hold');
  static readonly COMPLETED = new ProjectStatus('completed');
  static readonly ARCHIVED = new ProjectStatus('archived');

  private static readonly validStatuses = [
    'planning',
    'active',
    'on_hold',
    'completed',
    'archived',
  ];

  static create(value: string): ProjectStatus {
    if (!this.validStatuses.includes(value)) {
      throw new InvalidProjectStatusException(value);
    }
    return new ProjectStatus(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ProjectStatus): boolean {
    return this.value === other.getValue();
  }

  isPlanning(): boolean {
    return this.value === 'planning';
  }

  isActive(): boolean {
    return this.value === 'active';
  }

  isCompleted(): boolean {
    return this.value === 'completed';
  }
}
