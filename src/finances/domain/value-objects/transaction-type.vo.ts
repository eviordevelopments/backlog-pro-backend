export class TransactionType {
  private constructor(private readonly value: string) {}

  static readonly INCOME = new TransactionType('income');
  static readonly EXPENSE = new TransactionType('expense');
  static readonly REFUND = new TransactionType('refund');

  static create(value: string): TransactionType {
    const validTypes = [
      TransactionType.INCOME,
      TransactionType.EXPENSE,
      TransactionType.REFUND,
    ];

    const type = validTypes.find((t) => t.getValue() === value);
    if (!type) {
      throw new Error(`Invalid transaction type: ${value}`);
    }
    return type;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: TransactionType): boolean {
    return this.value === other.getValue();
  }
}
