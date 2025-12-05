import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver, Subscription } from '@nestjs/graphql';

import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CalculateProjectMetricsQuery } from '../application/queries/calculate-project-metrics.query';
import { CalculateProjectMetricsQueryHandler } from '../application/queries/calculate-project-metrics.query-handler';
import { CalculateSprintMetricsQuery } from '../application/queries/calculate-sprint-metrics.query';
import { CalculateSprintMetricsQueryHandler } from '../application/queries/calculate-sprint-metrics.query-handler';
import { GetDashboardMetricsQuery } from '../application/queries/get-dashboard-metrics.query';
import { GetDashboardMetricsQueryHandler } from '../application/queries/get-dashboard-metrics.query-handler';
import { MetricsEventService } from '../application/services/metrics-event.service';
import { DashboardMetricsResponseDto } from '../dto/response/dashboard-metrics.response.dto';
import { ProjectMetricsResponseDto } from '../dto/response/project-metrics.response.dto';
import { SprintMetricsResponseDto } from '../dto/response/sprint-metrics.response.dto';

@Resolver('Metrics')
export class MetricsResolver {
  constructor(
    private readonly sprintMetricsHandler: CalculateSprintMetricsQueryHandler,
    private readonly projectMetricsHandler: CalculateProjectMetricsQueryHandler,
    private readonly dashboardMetricsHandler: GetDashboardMetricsQueryHandler,
    private readonly metricsEventService: MetricsEventService,
  ) {}

  @Query(() => SprintMetricsResponseDto)
  @UseGuards(JwtAuthGuard)
  async getSprintMetrics(@Args('sprintId') sprintId: string): Promise<SprintMetricsResponseDto> {
    const query = new CalculateSprintMetricsQuery(sprintId);
    return this.sprintMetricsHandler.handle(query);
  }

  @Query(() => ProjectMetricsResponseDto)
  @UseGuards(JwtAuthGuard)
  async getProjectMetrics(
    @Args('projectId') projectId: string,
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

  @Subscription(() => ProjectMetricsResponseDto)
  @UseGuards(JwtAuthGuard)
  projectMetricsUpdated(@Args('projectId') _projectId: string) {
    return this.metricsEventService
      .getProjectMetricsUpdates()
      .pipe
      // Filter events for this project
      ();
  }

  @Subscription(() => DashboardMetricsResponseDto)
  @UseGuards(JwtAuthGuard)
  dashboardMetricsUpdated() {
    return this.metricsEventService
      .getDashboardMetricsUpdates()
      .pipe
      // All dashboard updates
      ();
  }
}
