import { Injectable } from '@nestjs/common';
import { GetProjectBacklogQuery } from './get-project-backlog.query';
import { UserStoryRepository } from '@user-stories/repository/user-story.repository';

@Injectable()
export class GetProjectBacklogQueryHandler {
  constructor(private readonly userStoryRepository: UserStoryRepository) {}

  async handle(query: GetProjectBacklogQuery): Promise<any[]> {
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
