import { Injectable } from '@nestjs/common';

import { RelationshipNotFoundException } from '../exceptions/relationship-not-found.exception';

/**
 * Servicio para validar la existencia de relaciones entre entidades
 * Se utiliza en los command handlers para verificar que las entidades relacionadas existan
 */
@Injectable()
export class RelationshipValidatorService {
  /**
   * Valida que una entidad relacionada exista
   * @param entity La entidad relacionada (null si no existe)
   * @param entityType Tipo de entidad (ej: "Project", "User")
   * @param entityId ID de la entidad
   * @param relationshipType Tipo de relación (ej: "Project", "User")
   */
  validateRelationshipExists(
    entity: unknown,
    entityType: string,
    entityId: string,
    relationshipType: string,
  ): void {
    if (!entity) {
      throw new RelationshipNotFoundException(entityType, entityId, relationshipType);
    }
  }

  /**
   * Valida múltiples relaciones a la vez
   * @param relationships Array de tuplas [entity, entityType, entityId, relationshipType]
   */
  validateMultipleRelationships(relationships: Array<[unknown, string, string, string]>): void {
    for (const [entity, entityType, entityId, relationshipType] of relationships) {
      this.validateRelationshipExists(entity, entityType, entityId, relationshipType);
    }
  }
}
