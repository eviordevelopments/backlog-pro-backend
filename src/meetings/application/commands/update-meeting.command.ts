export class UpdateMeetingCommand {
  constructor(
    public readonly id: string,
    public readonly title?: string,
    public readonly type?: string,
    public readonly dateTime?: Date,
    public readonly duration?: number,
    public readonly agenda?: string,
    public readonly notes?: string,
    public readonly participants?: string[],
    public readonly status?: string,
    public readonly isRecurring?: boolean,
    public readonly recurringPattern?: string | null,
  ) {}
}