import { Injectable } from '@nestjs/common';

import { UserStoryRepository } from '../../repository/user-story.repository';
import { DeleteUserStoryCommand } from './delete-user-story.command';

@Injectable()
export class DeleteUserStoryCommandHandler {
  constructor(private readonly userStoryRepository: UserStoryRepository) {}

  async handle(command: DeleteUserStoryCommand): Promise<void> {
    const userStory = await this.userStoryRepository.getById(command.id);

    if (!userStory) {
      throw new Error(`User story with id ${command.id} not found`);
    }

    // Soft delete
    await this.userStoryRepository.delete(command.id);
  }
}
