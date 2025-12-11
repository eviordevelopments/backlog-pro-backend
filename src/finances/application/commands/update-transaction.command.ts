export class UpdateTransactionCommand {
  constructor(
    public readonly id: string,
    public readonly category?: string,
    public readonly amount?: number,
    public readonly currency?: string,
    public readonly date?: Date,
    public readonly description?: string,
    public readonly isRecurring?: boolean,
    public readonly recurringFrequency?: string | null,
  ) {}
}