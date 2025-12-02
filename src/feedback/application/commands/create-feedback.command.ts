export class CreateFeedbackCommand {
  constructor(
    public readonly fromUserId: string,
    public readonly toUserId: string,
    public readonly type: string,
    public readonly category: string,
    public readonly rating: number,
    public readonly comment: string,
    public readonly isAnonymous: boolean,
    public readonly sprintId?: string,
  ) {}
}
