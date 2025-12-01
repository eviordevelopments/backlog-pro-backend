export class GetClientQuery {
  constructor(public readonly id: string) {}
}

export class ListClientsQuery {}

export class GetClientProjectsQuery {
  constructor(public readonly clientId: string) {}
}
