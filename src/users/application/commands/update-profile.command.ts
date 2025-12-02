export class UpdateProfileCommand {
  constructor(
    public readonly userId: string,
    public readonly name?: string,
    public readonly skills?: string[],
    public readonly hourlyRate?: number,
  ) {}
}
