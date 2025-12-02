export class ListTransactionsQuery {
  constructor(public readonly filters?: { clientId?: string; projectId?: string }) {}
}
