export class UpdateGoalProgressCommand {
  constructor(
    public readonly goalId: string,
    public readonly currentValue: number,
  ) {}
}
