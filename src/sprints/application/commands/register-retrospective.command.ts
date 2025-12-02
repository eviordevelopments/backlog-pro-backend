export class RegisterRetrospectiveCommand {
  constructor(
    public readonly id: string,
    public readonly notes: string,
  ) {}
}
