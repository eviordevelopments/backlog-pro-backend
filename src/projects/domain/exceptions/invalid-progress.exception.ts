import { BaseDomainException } from '@shared/exceptions';

export class InvalidProgressException extends BaseDomainException {
  constructor(progress: number) {
    super('PROJECT_002', `El progreso debe estar entre 0 y 100. Valor: ${progress}`);
  }
}
