export class ClientStatus {
  private constructor(private readonly value: string) {}

  static readonly ACTIVE = new ClientStatus('active');
  static readonly INACTIVE = new ClientStatus('inactive');
  static readonly PROSPECT = new ClientStatus('prospect');
  static readonly ARCHIVED = new ClientStatus('archived');

  getValue(): string {
    return this.value;
  }

  static fromString(value: string): ClientStatus {
    const statuses = [
      ClientStatus.ACTIVE,
      ClientStatus.INACTIVE,
      ClientStatus.PROSPECT,
      ClientStatus.ARCHIVED,
    ];

    const status = statuses.find((s) => s.getValue() === value);
    if (!status) {
      throw new Error(`Invalid client status: ${value}`);
    }
    return status;
  }

  equals(other: ClientStatus): boolean {
    return this.value === other.value;
  }
}
