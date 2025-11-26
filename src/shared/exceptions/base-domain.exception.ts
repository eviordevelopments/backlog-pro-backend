export abstract class BaseDomainException extends Error {
  constructor(
    public readonly codigo: string,
    public readonly mensaje: string,
  ) {
    super(mensaje);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
