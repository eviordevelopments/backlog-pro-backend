export class CreateProjectCommand {
  constructor(
    public readonly name: string,
    public readonly clientId: string,
    public readonly description?: string,
    public readonly methodology?: string,
    public readonly budget?: number,
    public readonly startDate?: Date,
    public readonly endDate?: Date,
  ) {}
}
