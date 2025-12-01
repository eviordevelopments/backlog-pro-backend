export class ProjectMetricsResponseDto {
  projectId!: string;
  projectName!: string;
  status!: string;
  progress!: number;
  totalTasks!: number;
  completedTasks!: number;
  totalStoryPoints!: number;
  completedStoryPoints!: number;
  budget!: number;
  spent!: number;
  remaining!: number;
  budgetUtilization!: number;
  totalSprints!: number;
  completedSprints!: number;
  averageVelocity!: number;
}
