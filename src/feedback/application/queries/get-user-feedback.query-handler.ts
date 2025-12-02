import { Injectable } from '@nestjs/common';
import { GetUserFeedbackQuery } from './get-user-feedback.query';
import { FeedbackRepository } from '@feedback/repository/feedback.repository';

@Injectable()
export class GetUserFeedbackQueryHandler {
  constructor(private readonly feedbackRepository: FeedbackRepository) {}

  async handle(query: GetUserFeedbackQuery): Promise<any[]> {
    const feedbacks = await this.feedbackRepository.getByToUserId(query.toUserId);

    return feedbacks.map((f) => ({
      id: f.getId(),
      fromUserId: f.isAnon() ? null : f.getFromUserId(),
      toUserId: f.getToUserId(),
      type: f.getType(),
      category: f.getCategory(),
      rating: f.getRating(),
      comment: f.getComment(),
      sprintId: f.getSprintId(),
      isAnonymous: f.isAnon(),
      createdAt: f.getCreatedAt(),
    }));
  }
}
