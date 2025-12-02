export class SprintStatus {
  private constructor(private readonly value: string) {}

  static readonly PLANNING = new SprintStatus('planning');
  static readonly ACTIVE = new SprintStatus('active');
  static readonly COMPLETED = new SprintStatus('completed');
  static readonly CANCELLED = new SprintStatus('cancelled');

  getValue(): string {
    return this.value;
  }

  static fromString(value: string): SprintStatus {
    const statuses = [
      SprintStatus.PLANNING,
      SprintStatus.ACTIVE,
      SprintStatus.COMPLETED,
      SprintStatus.CANCELLED,
    ];

    const status = statuses.find((s) => s.getValue() === value);
    if (!status) {
      throw new Error(`Invalid sprint status: ${value}`);
    }
    return status;
  }

  equals(other: SprintStatus): boolean {
    return this.value === other.value;
  }
}
