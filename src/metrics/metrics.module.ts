import { Module } from '@nestjs/common';

import { ProjectsModule } from '../projects/projects.module';
import { SprintsModule } from '../sprints/sprints.module';
import { TasksModule } from '../tasks/tasks.module';

import { CalculateProjectMetricsQueryHandler } from './application/queries/calculate-project-metrics.query-handler';
import { CalculateSprintMetricsQueryHandler } from './application/queries/calculate-sprint-metrics.query-handler';
import { GetDashboardMetricsQueryHandler } from './application/queries/get-dashboard-metrics.query-handler';
import { MetricsEventService } from './application/services/metrics-event.service';
import { MetricsResolver } from './resolvers/metrics.resolver';

@Module({
  imports: [SprintsModule, TasksModule, ProjectsModule],
  providers: [
    CalculateSprintMetricsQueryHandler,
    CalculateProjectMetricsQueryHandler,
    GetDashboardMetricsQueryHandler,
    MetricsEventService,
    MetricsResolver,
  ],
  exports: [
    CalculateSprintMetricsQueryHandler,
    CalculateProjectMetricsQueryHandler,
    GetDashboardMetricsQueryHandler,
    MetricsEventService,
  ],
})
export class MetricsModule {}
