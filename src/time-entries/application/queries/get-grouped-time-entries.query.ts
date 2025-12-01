export class GetGroupedTimeEntriesQuery {
  constructor(
    public readonly userId: string,
    public readonly groupBy: 'project' | 'task' | 'date' = 'project',
  ) {}
}
