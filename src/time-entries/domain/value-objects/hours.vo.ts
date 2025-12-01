export class Hours {
  private constructor(private readonly value: number) {
    if (value < 0) {
      throw new Error('Hours cannot be negative');
    }
    if (value > 24) {
      throw new Error('Hours cannot exceed 24 per day');
    }
  }

  static create(value: number): Hours {
    return new Hours(value);
  }

  getValue(): number {
    return this.value;
  }

  equals(other: Hours): boolean {
    return this.value === other.value;
  }
}
