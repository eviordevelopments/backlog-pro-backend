export class CreateRiskCommand {
  constructor(
    public readonly projectId: string,
    public readonly title: string,
    public readonly category: string,
    public readonly probability: string,
    public readonly impact: string,
    public readonly responsibleId: string,
    public readonly description?: string,
    public readonly mitigationStrategy?: string,
    public readonly isCore?: boolean,
  ) {}
}
