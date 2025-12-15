export class UpdateClientCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly email?: string,
    public readonly phone?: string,
    public readonly company?: string,
    public readonly industry?: string,
    public readonly ltv?: number,
    public readonly cac?: number,
    public readonly mrr?: number,
  ) {}
}
