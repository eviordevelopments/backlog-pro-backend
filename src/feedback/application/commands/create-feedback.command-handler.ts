import { Injectable } from '@nestjs/common';

import { Feedback } from '../../domain/entities/feedback.entity';
import { FeedbackRepository } from '../../repository/feedback.repository';

import { CreateFeedbackCommand } from './create-feedback.command';

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
