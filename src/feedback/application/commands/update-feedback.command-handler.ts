import { Injectable } from '@nestjs/common';

import { Feedback } from '../../domain/entities/feedback.entity';
import { FeedbackRepository } from '../../repository/feedback.repository';
import { UpdateFeedbackCommand } from './update-feedback.command';

@Injectable()
export class UpdateFeedbackCommandHandler {
  constructor(private readonly feedbackRepository: FeedbackRepository) {}

  async handle(command: UpdateFeedbackCommand): Promise<Feedback> {
    const feedback = await this.feedbackRepository.getById(command.id);

    if (!feedback) {
      throw new Error(`Feedback with id ${command.id} not found`);
    }

    // Create updated feedback with new values
    const updatedFeedback = new Feedback(
      feedback.getFromUserId(),
      feedback.getToUserId(),
      command.type ?? feedback.getType(),
      command.category ?? feedback.getCategory(),
      command.rating ?? feedback.getRating(),
      command.comment ?? feedback.getComment(),
      feedback.isAnon(),
      feedback.getSprintId(),
      feedback.getId(),
      feedback.getCreatedAt(),
      new Date(), // updatedAt
      feedback.getDeletedAt(),
    );

    return this.feedbackRepository.update(command.id, updatedFeedback);
  }
}
