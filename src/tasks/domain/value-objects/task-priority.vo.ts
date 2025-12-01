export class TaskPriority {
  private constructor(private readonly value: string) {}

  static readonly LOW = new TaskPriority('low');
  static readonly MEDIUM = new TaskPriority('medium');
  static readonly HIGH = new TaskPriority('high');
  static readonly CRITICAL = new TaskPriority('critical');

  getValue(): string {
    return this.value;
  }

  static fromString(value: string): TaskPriority {
    const priorities = [
      TaskPriority.LOW,
      TaskPriority.MEDIUM,
      TaskPriority.HIGH,
      TaskPriority.CRITICAL,
    ];

    const priority = priorities.find((p) => p.getValue() === value);
    if (!priority) {
      throw new Error(`Invalid task priority: ${value}`);
    }
    return priority;
  }

  equals(other: TaskPriority): boolean {
    return this.value === other.value;
  }
}
