export class UpdateProjectCommand {
  constructor(
    public readonly projectId: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly methodology?: string,
    public readonly budget?: number,
    public readonly status?: string,
    public readonly progress?: number,
    public readonly startDate?: Date,
    public readonly endDate?: Date,
  ) {}
}
