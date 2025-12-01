import { Injectable } from '@nestjs/common';
import { CalculateProjectMetricsQuery } from './calculate-project-metrics.query';
import { ProjectRepository } from '@projects/repository/project.repository';
import { SprintRepository } from '@sprints/repository/sprint.repository';
import { TaskRepository } from '@tasks/repository/task.repository';

@Injectable()
export class CalculateProjectMetricsQueryHandler {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly sprintRepository: SprintRepository,
    private readonly taskRepository: TaskRepository,
  ) {}

  async handle(query: CalculateProjectMetricsQuery): Promise<any> {
    const project = await this.projectRepository.getById(query.projectId);
    if (!project) {
      throw new Error(`Project with id ${query.projectId} not found`);
    }

    const sprints = await this.sprintRepository.getByProjectId(query.projectId);
    const tasks = await this.taskRepository.getByProjectId(query.projectId);

    // Calculate metrics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.getStatus().getValue() === 'done').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const totalStoryPoints = tasks.reduce((sum, t) => sum + t.getStoryPoints(), 0);
    const completedStoryPoints = tasks
      .filter((t) => t.getStatus().getValue() === 'done')
      .reduce((sum, t) => sum + t.getStoryPoints(), 0);

    const budget = project.budget;
    const spent = project.spent;
    const remaining = budget - spent;
    const budgetUtilization = budget > 0 ? Math.round((spent / budget) * 100) : 0;

    const completedSprints = sprints.filter((s) => s.getStatus().getValue() === 'completed');
    const averageVelocity =
      completedSprints.length > 0
        ? completedSprints.reduce((sum, s) => sum + s.getVelocity(), 0) / completedSprints.length
        : 0;

    return {
      projectId: query.projectId,
      projectName: project.name,
      status: project.status,
      progress,
      totalTasks,
      completedTasks,
      totalStoryPoints,
      completedStoryPoints,
      budget,
      spent,
      remaining,
      budgetUtilization,
      totalSprints: sprints.length,
      completedSprints: completedSprints.length,
      averageVelocity: Math.round(averageVelocity * 100) / 100,
    };
  }
}
