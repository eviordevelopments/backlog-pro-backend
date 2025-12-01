import { InvalidHourlyRateException } from '@users/domain/exceptions/invalid-hourly-rate.exception';

export class HourlyRate {
  private readonly value: number;

  constructor(value: number) {
    if (value < 0) {
      throw new InvalidHourlyRateException(value);
    }
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }

  equals(other: HourlyRate): boolean {
    return this.value === other.getValue();
  }
}
