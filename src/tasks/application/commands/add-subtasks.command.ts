export class AddSubtasksCommand {
  constructor(
    public readonly taskId: string,
    public readonly subtasks: string[],
  ) {}
}
