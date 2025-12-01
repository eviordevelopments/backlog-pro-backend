import { Module } from '@nestjs/common';
import { CalculateSprintMetricsQueryHandler } from '@metrics/application/queries/calculate-sprint-metrics.query-handler';
import { CalculateProjectMetricsQueryHandler } from '@metrics/application/queries/calculate-project-metrics.query-handler';
import { GetDashboardMetricsQueryHandler } from '@metrics/application/queries/get-dashboard-metrics.query-handler';
import { MetricsResolver } from '@metrics/resolvers/metrics.resolver';
import { SprintsModule } from '@sprints/sprints.module';
import { TasksModule } from '@tasks/tasks.module';
import { ProjectsModule } from '@projects/projects.module';

@Module({
  imports: [SprintsModule, TasksModule, ProjectsModule],
  providers: [
    CalculateSprintMetricsQueryHandler,
    CalculateProjectMetricsQueryHandler,
    GetDashboardMetricsQueryHandler,
    MetricsResolver,
  ],
  exports: [
    CalculateSprintMetricsQueryHandler,
    CalculateProjectMetricsQueryHandler,
    GetDashboardMetricsQueryHandler,
  ],
})
export class MetricsModule {}
