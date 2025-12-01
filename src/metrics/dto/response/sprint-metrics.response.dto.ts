export class SprintMetricsResponseDto {
  sprintId!: string;
  sprintName!: string;
  status!: string;
  storyPointsCommitted!: number;
  storyPointsCompleted!: number;
  velocity!: number;
  completionRate!: number;
  totalTasks!: number;
  completedTasks!: number;
  averageCycleTime!: number;
  startDate!: Date;
  endDate!: Date;
}
