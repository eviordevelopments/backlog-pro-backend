export class ModifyTimeCommand {
  constructor(
    public readonly id: string,
    public readonly hours?: number,
    public readonly description?: string,
    public readonly date?: Date,
  ) {}
}
