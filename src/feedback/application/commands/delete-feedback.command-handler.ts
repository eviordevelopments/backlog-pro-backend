import { Injectable } from '@nestjs/common';

import { FeedbackRepository } from '../../repository/feedback.repository';
import { DeleteFeedbackCommand } from './delete-feedback.command';

@Injectable()
export class DeleteFeedbackCommandHandler {
  constructor(private readonly feedbackRepository: FeedbackRepository) {}

  async handle(command: DeleteFeedbackCommand): Promise<void> {
    const feedback = await this.feedbackRepository.getById(command.id);

    if (!feedback) {
      throw new Error(`Feedback with id ${command.id} not found`);
    }

    // Soft delete
    await this.feedbackRepository.delete(command.id);
  }
}
