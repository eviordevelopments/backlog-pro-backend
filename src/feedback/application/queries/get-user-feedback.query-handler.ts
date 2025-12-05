import { Injectable } from '@nestjs/common';

import { FeedbackResponseDto } from '../../dto/response/feedback.response.dto';
import { FeedbackRepository } from '../../repository/feedback.repository';

import { GetUserFeedbackQuery } from './get-user-feedback.query';

@Injectable()
export class GetUserFeedbackQueryHandler {
  constructor(private readonly feedbackRepository: FeedbackRepository) {}

  async handle(query: GetUserFeedbackQuery): Promise<FeedbackResponseDto[]> {
    const feedbacks = await this.feedbackRepository.getByToUserId(query.toUserId);

    return feedbacks.map((f) => ({
      id: f.getId(),
      fromUserId: f.isAnon() ? undefined : f.getFromUserId(),
      toUserId: f.getToUserId(),
      type: f.getType(),
      category: f.getCategory(),
      rating: f.getRating(),
      comment: f.getComment(),
      sprintId: f.getSprintId(),
      isAnonymous: f.isAnon(),
      createdAt: f.getCreatedAt(),
      updatedAt: f.getUpdatedAt(),
    }));
  }
}
