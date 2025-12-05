import { Injectable } from '@nestjs/common';

import { Feedback } from '../../domain/entities/feedback.entity';
import { FeedbackTypeOrmEntity } from '../entities/feedback.typeorm-entity';

@Injectable()
export class FeedbackMapper {
  toDomain(raw: FeedbackTypeOrmEntity): Feedback {
    return new Feedback(
      raw.fromUserId,
      raw.toUserId,
      raw.type,
      raw.category,
      raw.rating,
      raw.comment,
      raw.isAnonymous,
      raw.sprintId,
      raw.id,
      raw.createdAt,
      raw.updatedAt,
      raw.deletedAt,
    );
  }

  toPersistence(feedback: Feedback): Partial<FeedbackTypeOrmEntity> {
    return {
      id: feedback.getId(),
      fromUserId: feedback.getFromUserId(),
      toUserId: feedback.getToUserId(),
      type: feedback.getType(),
      category: feedback.getCategory(),
      rating: feedback.getRating(),
      comment: feedback.getComment(),
      sprintId: feedback.getSprintId(),
      isAnonymous: feedback.isAnon(),
      createdAt: feedback.getCreatedAt(),
      updatedAt: feedback.getUpdatedAt(),
      deletedAt: feedback.getDeletedAt() ?? undefined,
    };
  }
}
