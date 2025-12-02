export class RegisterTimeCommand {
  constructor(
    public readonly taskId: string,
    public readonly userId: string,
    public readonly hours: number,
    public readonly date: Date,
    public readonly description?: string,
  ) {}
}
