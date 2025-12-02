import { BaseDomainException } from '@shared/exceptions/base-domain.exception';

export class RelationshipNotFoundException extends BaseDomainException {
  constructor(entityType: string, entityId: string, relationshipType: string) {
    super(
      'RELATIONSHIP_NOT_FOUND',
      `${relationshipType} with ID ${entityId} not found for ${entityType}`,
    );
  }
}
