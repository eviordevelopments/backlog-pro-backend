export class TaskStatus {
  private constructor(private readonly value: string) {}

  static readonly TODO = new TaskStatus('todo');
  static readonly IN_PROGRESS = new TaskStatus('in_progress');
  static readonly IN_REVIEW = new TaskStatus('in_review');
  static readonly DONE = new TaskStatus('done');
  static readonly BLOCKED = new TaskStatus('blocked');

  getValue(): string {
    return this.value;
  }

  static fromString(value: string): TaskStatus {
    const statuses = [
      TaskStatus.TODO,
      TaskStatus.IN_PROGRESS,
      TaskStatus.IN_REVIEW,
      TaskStatus.DONE,
      TaskStatus.BLOCKED,
    ];

    const status = statuses.find((s) => s.getValue() === value);
    if (!status) {
      throw new Error(`Invalid task status: ${value}`);
    }
    return status;
  }

  equals(other: TaskStatus): boolean {
    return this.value === other.value;
  }
}
