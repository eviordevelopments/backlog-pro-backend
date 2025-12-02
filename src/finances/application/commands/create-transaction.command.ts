export class CreateTransactionCommand {
  constructor(
    public readonly type: string,
    public readonly category: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly date: Date,
    public readonly description?: string,
    public readonly clientId?: string,
    public readonly projectId?: string,
    public readonly isRecurring?: boolean,
    public readonly recurringFrequency?: string,
  ) {}
}
