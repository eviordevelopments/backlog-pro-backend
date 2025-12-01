import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SprintService } from '@sprints/application/services/sprint.service';
import { SprintResponseDto } from '@sprints/dto/response/sprint.response.dto';
import { CreateSprintDto } from '@sprints/dto/request/create-sprint.dto';
import { UpdateSprintDto } from '@sprints/dto/request/update-sprint.dto';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import {
  CreateSprintCommand,
  UpdateSprintCommand,
  ExtendSprintCommand,
  CompleteSprintCommand,
  RegisterRetrospectiveCommand,
} from '@sprints/application/commands';
import {
  GetSprintQuery,
  ListSprintsProjectQuery,
} from '@sprints/application/queries';

@Resolver(() => SprintResponseDto)
@UseGuards(JwtAuthGuard)
export class SprintResolver {
  constructor(private readonly sprintService: SprintService) {}

  @Mutation(() => SprintResponseDto)
  async createSprint(
    @Args('input') input: CreateSprintDto,
  ): Promise<SprintResponseDto> {
    const command = new CreateSprintCommand(
      input.name,
      input.projectId,
      input.goal,
      new Date(input.startDate),
      new Date(input.endDate),
      input.dailyStandupTime,
    );

    const sprint = await this.sprintService.createSprint(command);
    return this.mapToResponse(sprint);
  }

  @Mutation(() => SprintResponseDto)
  async updateSprint(
    @Args('id') id: string,
    @Args('input') input: UpdateSprintDto,
  ): Promise<SprintResponseDto> {
    const command = new UpdateSprintCommand(
      id,
      input.name,
      input.goal,
      input.endDate ? new Date(input.endDate) : undefined,
      input.status,
      input.velocity,
      input.storyPointsCommitted,
      input.storyPointsCompleted,
      input.teamMembers,
      input.dailyStandupTime,
      input.retrospectiveNotes,
    );

    const sprint = await this.sprintService.updateSprint(command);
    return this.mapToResponse(sprint);
  }

  @Mutation(() => SprintResponseDto)
  async extendSprint(
    @Args('id') id: string,
    @Args('newEndDate') newEndDate: string,
  ): Promise<SprintResponseDto> {
    const command = new ExtendSprintCommand(id, new Date(newEndDate));
    const sprint = await this.sprintService.extendSprint(command);
    return this.mapToResponse(sprint);
  }

  @Mutation(() => SprintResponseDto)
  async completeSprint(@Args('id') id: string): Promise<SprintResponseDto> {
    const command = new CompleteSprintCommand(id);
    const sprint = await this.sprintService.completeSprint(command);
    return this.mapToResponse(sprint);
  }

  @Mutation(() => SprintResponseDto)
  async registerRetrospective(
    @Args('id') id: string,
    @Args('notes') notes: string,
  ): Promise<SprintResponseDto> {
    const command = new RegisterRetrospectiveCommand(id, notes);
    const sprint = await this.sprintService.registerRetrospective(command);
    return this.mapToResponse(sprint);
  }

  @Query(() => SprintResponseDto)
  async getSprint(@Args('id') id: string): Promise<SprintResponseDto> {
    const query = new GetSprintQuery(id);
    const sprint = await this.sprintService.getSprint(query);
    return this.mapToResponse(sprint);
  }

  @Query(() => [SprintResponseDto])
  async listSprintsByProject(
    @Args('projectId') projectId: string,
  ): Promise<SprintResponseDto[]> {
    const query = new ListSprintsProjectQuery(projectId);
    const sprints = await this.sprintService.listSprintsByProject(query);
    return sprints.map((sprint) => this.mapToResponse(sprint));
  }

  private mapToResponse(sprint: any): SprintResponseDto {
    return {
      id: sprint.getId(),
      name: sprint.getName(),
      projectId: sprint.getProjectId(),
      goal: sprint.getGoal(),
      startDate: sprint.getStartDate(),
      endDate: sprint.getEndDate(),
      status: sprint.getStatus().getValue(),
      velocity: sprint.getVelocity(),
      storyPointsCommitted: sprint.getStoryPointsCommitted(),
      storyPointsCompleted: sprint.getStoryPointsCompleted(),
      teamMembers: sprint.getTeamMembers(),
      sprintPlanningDate: sprint.getSprintPlanningDate(),
      sprintReviewDate: sprint.getSprintReviewDate(),
      sprintRetrospectiveDate: sprint.getSprintRetrospectiveDate(),
      dailyStandupTime: sprint.getDailyStandupTime(),
      retrospectiveNotes: sprint.getRetrospectiveNotes(),
      createdAt: sprint.getCreatedAt(),
      updatedAt: sprint.getUpdatedAt(),
    };
  }
}
