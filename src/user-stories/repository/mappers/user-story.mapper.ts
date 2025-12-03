import { Injectable } from '@nestjs/common';

import { UserStory } from '../../domain/entities/user-story.entity';
import { UserStoryTypeOrmEntity } from '../entities/user-story.typeorm-entity';

@Injectable()
export class UserStoryMapper {
  toDomain(raw: UserStoryTypeOrmEntity): UserStory {
    return new UserStory(
      raw.projectId,
      raw.title,
      raw.userType,
      raw.action,
      raw.benefit,
      raw.priority,
      raw.sprintId,
      raw.acceptanceCriteria || [],
      raw.storyPoints,
      raw.status,
      raw.assignedTo,
      raw.definitionOfDone,
      raw.impactMetrics,
      raw.id,
      raw.createdAt,
      raw.updatedAt,
      raw.deletedAt,
    );
  }

  toPersistence(userStory: UserStory): Partial<UserStoryTypeOrmEntity> {
    return {
      id: userStory.getId(),
      projectId: userStory.getProjectId(),
      sprintId: userStory.getSprintId(),
      title: userStory.getTitle(),
      userType: userStory.getUserType(),
      action: userStory.getAction(),
      benefit: userStory.getBenefit(),
      acceptanceCriteria: userStory.getAcceptanceCriteria(),
      storyPoints: userStory.getStoryPoints(),
      priority: userStory.getPriority(),
      status: userStory.getStatus(),
      assignedTo: userStory.getAssignedTo(),
      definitionOfDone: userStory.getDefinitionOfDone(),
      impactMetrics: userStory.getImpactMetrics(),
      createdAt: userStory.getCreatedAt(),
      updatedAt: userStory.getUpdatedAt(),
      deletedAt: userStory.getDeletedAt() ?? undefined,
    };
  }
}
