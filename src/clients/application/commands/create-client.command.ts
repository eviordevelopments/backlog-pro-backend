export class CreateClientCommand {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly phone?: string,
    public readonly company?: string,
    public readonly industry?: string,
  ) {}
}
