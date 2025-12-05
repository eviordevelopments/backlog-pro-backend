import { Injectable } from '@nestjs/common';

import { Sprint } from '../../domain/entities/sprint.entity';
import { SprintStatus } from '../../domain/value-objects/sprint-status.vo';
import { SprintTypeOrmEntity } from '../entities/sprint.typeorm-entity';

@Injectable()
export class SprintMapper {
  toDomain(entity: SprintTypeOrmEntity): Sprint {
    return new Sprint(
      entity.name,
      entity.projectId,
      entity.goal || '',
      entity.startDate,
      entity.endDate,
      entity.dailyStandupTime,
      entity.id,
      SprintStatus.fromString(entity.status),
      entity.velocity,
      entity.storyPointsCommitted,
      entity.storyPointsCompleted,
      entity.teamMembers,
      entity.sprintPlanningDate || null,
      entity.sprintReviewDate || null,
      entity.sprintRetrospectiveDate || null,
      entity.retrospectiveNotes || null,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt || null,
    );
  }

  toPersistence(domain: Sprint): SprintTypeOrmEntity {
    const entity = new SprintTypeOrmEntity();
    entity.id = domain.getId();
    entity.name = domain.getName();
    entity.projectId = domain.getProjectId();
    entity.goal = domain.getGoal() || undefined;
    entity.startDate = domain.getStartDate();
    entity.endDate = domain.getEndDate();
    entity.status = domain.getStatus().getValue();
    entity.velocity = domain.getVelocity();
    entity.storyPointsCommitted = domain.getStoryPointsCommitted();
    entity.storyPointsCompleted = domain.getStoryPointsCompleted();
    entity.teamMembers = domain.getTeamMembers();
    entity.sprintPlanningDate = domain.getSprintPlanningDate() || undefined;
    entity.sprintReviewDate = domain.getSprintReviewDate() || undefined;
    entity.sprintRetrospectiveDate = domain.getSprintRetrospectiveDate() || undefined;
    entity.dailyStandupTime = domain.getDailyStandupTime();
    entity.retrospectiveNotes = domain.getRetrospectiveNotes() || undefined;
    entity.createdAt = domain.getCreatedAt();
    entity.updatedAt = domain.getUpdatedAt();
    entity.deletedAt = domain.getDeletedAt() || undefined;
    return entity;
  }
}
