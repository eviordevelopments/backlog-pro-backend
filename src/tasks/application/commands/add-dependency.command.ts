export class AddDependencyCommand {
  constructor(
    public readonly taskId: string,
    public readonly dependsOnTaskId: string,
  ) {}
}
