import { BaseDomainException } from '../../../shared/exceptions/base-domain.exception';

export class ClientNotFoundException extends BaseDomainException {
  constructor(id: string) {
    super('CLIENT_001', `Client with ID ${id} not found`);
  }
}
