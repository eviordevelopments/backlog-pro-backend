export class CreateUserStoryCommand {
  constructor(
    public readonly projectId: string,
    public readonly title: string,
    public readonly userType: string,
    public readonly action: string,
    public readonly benefit: string,
    public readonly priority: string,
    public readonly sprintId?: string,
    public readonly acceptanceCriteria?: string[],
    public readonly storyPoints?: number,
    public readonly definitionOfDone?: string,
    public readonly impactMetrics?: string,
  ) {}
}
