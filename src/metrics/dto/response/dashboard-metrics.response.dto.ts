import { ProjectMetricsResponseDto } from './project-metrics.response.dto';

export class DashboardMetricsResponseDto {
  timestamp!: Date;
  totalProjects!: number;
  totalBudget!: number;
  totalSpent!: number;
  remainingBudget!: number;
  budgetUtilization!: number;
  totalTasks!: number;
  completedTasks!: number;
  overallProgress!: number;
  projects!: ProjectMetricsResponseDto[];
}
