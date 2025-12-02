import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RelationshipNotFoundException } from '@shared/exceptions/relationship-not-found.exception';

/**
 * Interceptor para validar la existencia de relaciones entre entidades
 * Verifica que las entidades relacionadas existan antes de crear relaciones
 */
@Injectable()
export class RelationshipValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    // Validar que los IDs de relaciones existan
    if (body && typeof body === 'object') {
      this.validateRelationshipIds(body);
    }

    return next.handle();
  }

  private validateRelationshipIds(obj: any): void {
    // Patrones comunes de IDs de relaciones
    const relationshipPatterns = [
      'projectId',
      'sprintId',
      'taskId',
      'userId',
      'clientId',
      'ownerId',
      'responsibleId',
      'assignedTo',
      'fromUserId',
      'toUserId',
      'achievementId',
    ];

    for (const key of Object.keys(obj)) {
      if (relationshipPatterns.includes(key)) {
        const value = obj[key];

        // Validar que el ID no sea null, undefined o vacío
        if (value === null || value === undefined || value === '') {
          throw new BadRequestException(
            `${key} is required and cannot be empty`,
          );
        }

        // Validar que sea un UUID válido si es un ID
        if (typeof value === 'string' && !this.isValidUUID(value)) {
          throw new BadRequestException(`${key} must be a valid UUID`);
        }
      }
    }
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
