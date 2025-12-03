import { InvalidBudgetException } from '../exceptions/index';

export class Budget {
  private readonly value: number;

  constructor(value: number) {
    if (value < 0) {
      throw new InvalidBudgetException(value);
    }
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }

  equals(other: Budget): boolean {
    return this.value === other.getValue();
  }

  isGreaterThan(other: Budget): boolean {
    return this.value > other.getValue();
  }

  isLessThan(other: Budget): boolean {
    return this.value < other.getValue();
  }
}
