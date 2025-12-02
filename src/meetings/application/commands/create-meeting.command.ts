export class CreateMeetingCommand {
  constructor(
    public readonly title: string,
    public readonly type: string,
    public readonly dateTime: Date,
    public readonly duration: number,
    public readonly ownerId: string,
    public readonly agenda?: string,
    public readonly notes?: string,
    public readonly projectId?: string,
    public readonly sprintId?: string,
    public readonly participants?: string[],
    public readonly isRecurring?: boolean,
    public readonly recurringPattern?: string,
  ) {}
}
