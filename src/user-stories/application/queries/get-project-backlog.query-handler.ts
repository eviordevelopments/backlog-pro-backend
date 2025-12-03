import { Injectable } from '@nestjs/common';

import { UserStoryResponseDto } from '../../dto/response/user-story.response.dto';
import { UserStoryRepository } from '../../repository/user-story.repository';

import { GetProjectBacklogQuery } from './get-project-backlog.query';

@Injectable()
export class GetProjectBacklogQueryHandler {
  constructor(private readonly userStoryRepository: UserStoryRepository) {}

  async handle(query: GetProjectBacklogQuery): Promise<UserStoryResponseDto[]> {
    const userStories = await this.userStoryRepository.getBacklog(query.projectId);

    return userStories.map((us) => ({
      id: us.getId(),
      title: us.getTitle(),
      userType: us.getUserType(),
      action: us.getAction(),
      benefit: us.getBenefit(),
      priority: us.getPriority(),
      storyPoints: us.getStoryPoints(),
      status: us.getStatus(),
      acceptanceCriteria: us.getAcceptanceCriteria(),
    }));
  }
}
