export class Currency {
  private constructor(private readonly value: string) {}

  static readonly USD = new Currency('USD');
  static readonly EUR = new Currency('EUR');
  static readonly MXN = new Currency('MXN');
  static readonly ARS = new Currency('ARS');

  static create(value: string): Currency {
    const validCurrencies = [
      Currency.USD,
      Currency.EUR,
      Currency.MXN,
      Currency.ARS,
    ];

    const currency = validCurrencies.find((c) => c.getValue() === value);
    if (!currency) {
      throw new Error(`Invalid currency: ${value}`);
    }
    return currency;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Currency): boolean {
    return this.value === other.getValue();
  }
}
