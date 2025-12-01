export class Amount {
  private constructor(private readonly value: number) {}

  static create(value: number): Amount {
    if (value < 0) {
      throw new Error('Amount cannot be negative');
    }
    return new Amount(value);
  }

  getValue(): number {
    return this.value;
  }

  add(other: Amount): Amount {
    return Amount.create(this.value + other.getValue());
  }

  subtract(other: Amount): Amount {
    return Amount.create(this.value - other.getValue());
  }

  multiply(factor: number): Amount {
    return Amount.create(this.value * factor);
  }

  equals(other: Amount): boolean {
    return this.value === other.getValue();
  }

  isGreaterThan(other: Amount): boolean {
    return this.value > other.getValue();
  }

  isLessThan(other: Amount): boolean {
    return this.value < other.getValue();
  }
}
