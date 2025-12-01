export class GetWorkedHoursQuery {
  constructor(
    public readonly userId: string,
    public readonly projectId?: string,
  ) {}
}
