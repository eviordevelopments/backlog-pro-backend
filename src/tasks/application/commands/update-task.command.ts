export class UpdateTaskCommand {
  constructor(
    public readonly id: string,
    public readonly title?: string,
    public readonly description?: string,
    public readonly status?: string,
    public readonly priority?: string,
    public readonly estimatedHours?: number,
    public readonly storyPoints?: number,
    public readonly dueDate?: Date,
    public readonly tags?: string[],
  ) {}
}
