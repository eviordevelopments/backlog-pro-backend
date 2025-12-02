import { Injectable } from '@nestjs/common';
import { Risk } from '@risks/domain/entities/risk.entity';
import { RiskTypeOrmEntity } from '@risks/repository/entities/risk.typeorm-entity';

@Injectable()
export class RiskMapper {
  toDomain(raw: RiskTypeOrmEntity): Risk {
    return new Risk(
      raw.projectId,
      raw.title,
      raw.category,
      raw.probability,
      raw.impact,
      raw.responsibleId,
      raw.description,
      raw.mitigationStrategy,
      raw.isCore,
      raw.status,
      raw.comments || [],
      raw.id,
      raw.createdAt,
      raw.updatedAt,
      raw.deletedAt,
    );
  }

  toPersistence(risk: Risk): Partial<RiskTypeOrmEntity> {
    return {
      id: risk.getId(),
      projectId: risk.getProjectId(),
      title: risk.getTitle(),
      description: risk.getDescription(),
      category: risk.getCategory(),
      probability: risk.getProbability(),
      impact: risk.getImpact(),
      mitigationStrategy: risk.getMitigationStrategy(),
      responsibleId: risk.getResponsibleId(),
      status: risk.getStatus(),
      isCore: risk.isCorRisk(),
      comments: risk.getComments(),
      createdAt: risk.getCreatedAt(),
      updatedAt: risk.getUpdatedAt(),
      deletedAt: risk.getDeletedAt() ?? undefined,
    };
  }
}
