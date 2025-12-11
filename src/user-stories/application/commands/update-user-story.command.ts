export class UpdateUserStoryCommand {
  constructor(
    public readonly id: string,
    public readonly title?: string,
    public readonly userType?: string,
    public readonly action?: string,
    public readonly benefit?: string,
    public readonly priority?: string,
    public readonly status?: string,
    public readonly sprintId?: string | null,
    public readonly assignedTo?: string | null,
    public readonly acceptanceCriteria?: string[],
    public readonly storyPoints?: number,
    public readonly definitionOfDone?: string,
    public readonly impactMetrics?: string,
  ) {}
}