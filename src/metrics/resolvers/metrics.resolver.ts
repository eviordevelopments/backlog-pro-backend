import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { CalculateSprintMetricsQueryHandler } from '@metrics/application/queries/calculate-sprint-metrics.query-handler';
import { CalculateSprintMetricsQuery } from '@metrics/application/queries/calculate-sprint-metrics.query';
import { CalculateProjectMetricsQueryHandler } from '@metrics/application/queries/calculate-project-metrics.query-handler';
import { CalculateProjectMetricsQuery } from '@metrics/application/queries/calculate-project-metrics.query';
import { GetDashboardMetricsQueryHandler } from '@metrics/application/queries/get-dashboard-metrics.query-handler';
import { GetDashboardMetricsQuery } from '@metrics/application/queries/get-dashboard-metrics.query';
import { SprintMetricsResponseDto } from '@metrics/dto/response/sprint-metrics.response.dto';
import { ProjectMetricsResponseDto } from '@metrics/dto/response/project-metrics.response.dto';
import { DashboardMetricsResponseDto } from '@metrics/dto/response/dashboard-metrics.response.dto';

@Resolver('Metrics')
export class MetricsResolver {
  constructor(
    private readonly sprintMetricsHandler: CalculateSprintMetricsQueryHandler,
    private readonly projectMetricsHandler: CalculateProjectMetricsQueryHandler,
    private readonly dashboardMetricsHandler: GetDashboardMetricsQueryHandler,
  ) {}

  @Query(() => SprintMetricsResponseDto)
  @UseGuards(JwtAuthGuard)
  async getSprintMetrics(
    @Args('sprintId') sprintId: string
  ): Promise<SprintMetricsResponseDto> {
    const query = new CalculateSprintMetricsQuery(sprintId);
    return this.sprintMetricsHandler.handle(query);
  }

  @Query(() => ProjectMetricsResponseDto)
  @UseGuards(JwtAuthGuard)
  async getProjectMetrics(
    @Args('projectId') projectId: string
  ): Promise<ProjectMetricsResponseDto> {
    const query = new CalculateProjectMetricsQuery(projectId);
    return this.projectMetricsHandler.handle(query);
  }

  @Query(() => DashboardMetricsResponseDto)
  @UseGuards(JwtAuthGuard)
  async getDashboardMetrics(): Promise<DashboardMetricsResponseDto> {
    const query = new GetDashboardMetricsQuery();
    return this.dashboardMetricsHandler.handle(query);
  }
}
