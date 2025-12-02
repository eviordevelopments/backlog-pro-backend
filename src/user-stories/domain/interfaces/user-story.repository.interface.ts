import { UserStory } from '@user-stories/domain/entities/user-story.entity';

export interface IUserStoryRepository {
  create(userStory: UserStory): Promise<UserStory>;
  update(id: string, userStory: Partial<UserStory>): Promise<UserStory>;
  getById(id: string): Promise<UserStory | null>;
  getByProjectId(projectId: string): Promise<UserStory[]>;
  getBySprintId(sprintId: string): Promise<UserStory[]>;
  getBacklog(projectId: string): Promise<UserStory[]>;
  list(): Promise<UserStory[]>;
  delete(id: string): Promise<void>;
}
