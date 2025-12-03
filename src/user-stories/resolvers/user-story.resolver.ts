import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CreateUserStoryCommand } from '../application/commands/create-user-story.command';
import { CreateUserStoryCommandHandler } from '../application/commands/create-user-story.command-handler';
import { GetProjectBacklogQuery } from '../application/queries/get-project-backlog.query';
import { GetProjectBacklogQueryHandler } from '../application/queries/get-project-backlog.query-handler';
import { CreateUserStoryDto } from '../dto/request/create-user-story.dto';
import { UserStoryResponseDto } from '../dto/response/user-story.response.dto';
import { UserStoryRepository } from '../repository/user-story.repository';

@Resolver('UserStory')
export class UserStoryResolver {
  constructor(
    private readonly createUserStoryHandler: CreateUserStoryCommandHandler,
    private readonly getBacklogHandler: GetProjectBacklogQueryHandler,
    private readonly userStoryRepository: UserStoryRepository,
  ) {}

  @Mutation(() => UserStoryResponseDto)
  @UseGuards(JwtAuthGuard)
  async createUserStory(@Args('input') input: CreateUserStoryDto): Promise<UserStoryResponseDto> {
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
      input.impactMetrics,
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
  async getProjectBacklog(@Args('projectId') projectId: string): Promise<UserStoryResponseDto[]> {
    const query = new GetProjectBacklogQuery(projectId);
    return this.getBacklogHandler.handle(query);
  }
}
