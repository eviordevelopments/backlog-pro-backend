import { Injectable } from '@nestjs/common';
import { CreateFeedbackCommand } from './create-feedback.command';
import { Feedback } from '@feedback/domain/entities/feedback.entity';
import { FeedbackRepository } from '@feedback/repository/feedback.repository';

@Injectable()
export class CreateFeedbackCommandHandler {
  constructor(private readonly feedbackRepository: FeedbackRepository) {}

  async handle(command: CreateFeedbackCommand): Promise<Feedback> {
    const feedback = new Feedback(
      command.fromUserId,
      command.toUserId,
      command.type,
      command.category,
      command.rating,
      command.comment,
      command.isAnonymous,
      command.sprintId,
    );

    return this.feedbackRepository.create(feedback);
  }
}
