export class CreateTaskCommand {
  constructor(
    public readonly title: string,
    public readonly projectId: string,
    public readonly description?: string,
    public readonly sprintId?: string,
    public readonly estimatedHours?: number,
    public readonly storyPoints?: number,
    public readonly dueDate?: Date,
    public readonly tags?: string[],
  ) {}
}
