import { Injectable } from '@nestjs/common';

import { UserStory } from '../../domain/entities/user-story.entity';
import { UserStoryRepository } from '../../repository/user-story.repository';

import { CreateUserStoryCommand } from './create-user-story.command';

@Injectable()
export class CreateUserStoryCommandHandler {
  constructor(private readonly userStoryRepository: UserStoryRepository) {}

  async handle(command: CreateUserStoryCommand): Promise<UserStory> {
    const userStory = new UserStory(
      command.projectId,
      command.title,
      command.userType,
      command.action,
      command.benefit,
      command.priority,
      command.sprintId,
      command.acceptanceCriteria?.map((desc, index) => ({
        id: `criteria-${index}`,
        description: desc,
        completed: false,
      })),
      command.storyPoints,
      'backlog',
      null,
      command.definitionOfDone,
      command.impactMetrics,
    );

    return this.userStoryRepository.create(userStory);
  }
}
