export class ListProjectsQuery {
  constructor(
    public readonly clientId?: string,
    public readonly status?: string,
    public readonly skip?: number,
    public readonly take?: number,
  ) {}
}
