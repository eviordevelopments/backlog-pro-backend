export class UpdateSprintCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly goal?: string,
    public readonly endDate?: Date,
    public readonly status?: string,
    public readonly velocity?: number,
    public readonly storyPointsCommitted?: number,
    public readonly storyPointsCompleted?: number,
    public readonly teamMembers?: string[],
    public readonly dailyStandupTime?: string,
    public readonly retrospectiveNotes?: string,
  ) {}
}
