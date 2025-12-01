export class InvoiceStatus {
  private constructor(private readonly value: string) {}

  static readonly DRAFT = new InvoiceStatus('draft');
  static readonly SENT = new InvoiceStatus('sent');
  static readonly PAID = new InvoiceStatus('paid');
  static readonly OVERDUE = new InvoiceStatus('overdue');
  static readonly CANCELLED = new InvoiceStatus('cancelled');

  static create(value: string): InvoiceStatus {
    const validStatuses = [
      InvoiceStatus.DRAFT,
      InvoiceStatus.SENT,
      InvoiceStatus.PAID,
      InvoiceStatus.OVERDUE,
      InvoiceStatus.CANCELLED,
    ];

    const status = validStatuses.find((s) => s.getValue() === value);
    if (!status) {
      throw new Error(`Invalid invoice status: ${value}`);
    }
    return status;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: InvoiceStatus): boolean {
    return this.value === other.getValue();
  }
}
