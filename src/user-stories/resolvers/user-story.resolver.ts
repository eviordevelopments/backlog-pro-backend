import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { CreateUserStoryCommandHandler } from '@user-stories/application/commands/create-user-story.command-handler';
import { CreateUserStoryCommand } from '@user-stories/application/commands/create-user-story.command';
import { GetProjectBacklogQueryHandler } from '@user-stories/application/queries/get-project-backlog.query-handler';
import { GetProjectBacklogQuery } from '@user-stories/application/queries/get-project-backlog.query';
import { UserStoryRepository } from '@user-stories/repository/user-story.repository';
import { CreateUserStoryDto } from '@user-stories/dto/request/create-user-story.dto';
import { UserStoryResponseDto } from '@user-stories/dto/response/user-story.response.dto';

@Resolver('UserStory')
export class UserStoryResolver {
  constructor(
    private readonly createUserStoryHandler: CreateUserStoryCommandHandler,
    private readonly getBacklogHandler: GetProjectBacklogQueryHandler,
    private readonly userStoryRepository: UserStoryRepository,
  ) {}

  @Mutation(() => UserStoryResponseDto)
  @UseGuards(JwtAuthGuard)
  async createUserStory(
    @Args('input') input: CreateUserStoryDto
  ): Promise<UserStoryResponseDto> {
    const command = new CreateUserStoryCommand(
      input.projectId,
      input.title,
      input.userType,
      input.action,
      input.benefit,
      input.priority,
      input.sprintId,
      input.acceptanceCriteria,
      input.storyPoints,
      input.definitionOfDone,
      input.impactMetrics
    );

    const userStory = await this.createUserStoryHandler.handle(command);

    return {
      id: userStory.getId(),
      projectId: userStory.getProjectId(),
      sprintId: userStory.getSprintId(),
      title: userStory.getTitle(),
      userType: userStory.getUserType(),
      action: userStory.getAction(),
      benefit: userStory.getBenefit(),
      acceptanceCriteria: userStory.getAcceptanceCriteria(),
      storyPoints: userStory.getStoryPoints(),
      priority: userStory.getPriority(),
      status: userStory.getStatus(),
      assignedTo: userStory.getAssignedTo(),
      definitionOfDone: userStory.getDefinitionOfDone(),
      impactMetrics: userStory.getImpactMetrics(),
      createdAt: userStory.getCreatedAt(),
      updatedAt: userStory.getUpdatedAt(),
    };
  }

  @Query(() => [UserStoryResponseDto])
  @UseGuards(JwtAuthGuard)
  async getProjectBacklog(
    @Args('projectId') projectId: string
  ): Promise<UserStoryResponseDto[]> {
    const query = new GetProjectBacklogQuery(projectId);
    return this.getBacklogHandler.handle(query);
  }
}
