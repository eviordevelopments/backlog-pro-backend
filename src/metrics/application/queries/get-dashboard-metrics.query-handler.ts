import { Injectable } from '@nestjs/common';

import { ProjectRepository } from '../../../projects/repository/project.repository';
import { DashboardMetricsResponseDto } from '../../dto/response/dashboard-metrics.response.dto';

import { CalculateProjectMetricsQueryHandler } from './calculate-project-metrics.query-handler';
import { CalculateProjectMetricsQuery } from './calculate-project-metrics.query';
import { GetDashboardMetricsQuery } from './get-dashboard-metrics.query';

@Injectable()
export class GetDashboardMetricsQueryHandler {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly projectMetricsHandler: CalculateProjectMetricsQueryHandler,
  ) {}

  async handle(_query: GetDashboardMetricsQuery): Promise<DashboardMetricsResponseDto> {
    // Get all active projects
    const projects = await this.projectRepository.list();
    const activeProjects = projects.filter(
      (p) => p.status !== 'completed' && p.status !== 'archived',
    );

    // Calculate metrics for each project
    const projectMetrics = await Promise.all(
      activeProjects.map((p) =>
        this.projectMetricsHandler.handle(new CalculateProjectMetricsQuery(p.id)),
      ),
    );

    // Aggregate metrics
    const totalProjects = activeProjects.length;
    const totalBudget = activeProjects.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = activeProjects.reduce((sum, p) => sum + p.spent, 0);

    interface ProjectMetrics {
      totalTasks: number;
      completedTasks: number;
    }

    const totalTasks = projectMetrics.reduce((sum, m) => sum + (m as ProjectMetrics).totalTasks, 0);
    const totalCompletedTasks = projectMetrics.reduce(
      (sum, m) => sum + (m as ProjectMetrics).completedTasks,
      0,
    );
    const overallProgress =
      totalTasks > 0 ? Math.round((totalCompletedTasks / totalTasks) * 100) : 0;

    return {
      timestamp: new Date(),
      totalProjects,
      totalBudget,
      totalSpent,
      remainingBudget: totalBudget - totalSpent,
      budgetUtilization: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0,
      totalTasks,
      completedTasks: totalCompletedTasks,
      overallProgress,
      projects: projectMetrics,
    };
  }
}
