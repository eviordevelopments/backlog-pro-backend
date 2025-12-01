export class CreateSprintCommand {
  constructor(
    public readonly name: string,
    public readonly projectId: string,
    public readonly goal: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly dailyStandupTime: string = '09:00',
  ) {}
}
