export class UpdateFeedbackCommand {
  constructor(
    public readonly id: string,
    public readonly type?: string,
    public readonly category?: string,
    public readonly rating?: number,
    public readonly comment?: string,
  ) {}
}