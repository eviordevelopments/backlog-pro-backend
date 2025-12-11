export class UpdateRiskCommand {
  constructor(
    public readonly id: string,
    public readonly title?: string,
    public readonly description?: string,
    public readonly category?: string,
    public readonly probability?: string,
    public readonly impact?: string,
    public readonly mitigationStrategy?: string,
    public readonly responsibleId?: string,
    public readonly status?: string,
    public readonly isCore?: boolean,
  ) {}
}
