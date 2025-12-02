export class CreateGoalCommand {
  constructor(
    public readonly title: string,
    public readonly type: string,
    public readonly category: string,
    public readonly period: string,
    public readonly targetValue: number,
    public readonly unit: string,
    public readonly ownerId: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly description?: string,
  ) {}
}
