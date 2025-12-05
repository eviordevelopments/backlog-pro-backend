import { Injectable } from '@nestjs/common';

import { SprintRepository } from '../../../sprints/repository/sprint.repository';
import { TaskRepository } from '../../../tasks/repository/task.repository';

import { CalculateSprintMetricsQuery } from './calculate-sprint-metrics.query';

@Injectable()
export class CalculateSprintMetricsQueryHandler {
  constructor(
    private readonly sprintRepository: SprintRepository,
    private readonly taskRepository: TaskRepository,
  ) {}

  async handle(query: CalculateSprintMetricsQuery): Promise<{
    sprintId: string;
    sprintName: string;
    status: string;
    storyPointsCommitted: number;
    storyPointsCompleted: number;
    velocity: number;
    completionRate: number;
    totalTasks: number;
    completedTasks: number;
    averageCycleTime: number;
    startDate: Date;
    endDate: Date;
  }> {
    const sprint = await this.sprintRepository.getById(query.sprintId);
    if (!sprint) {
      throw new Error(`Sprint with id ${query.sprintId} not found`);
    }

    const tasks = await this.taskRepository.getBySprintId(query.sprintId);

    // Calculate metrics
    const storyPointsCommitted = sprint.getStoryPointsCommitted();
    const storyPointsCompleted = sprint.getStoryPointsCompleted();
    const velocity = sprint.getVelocity();

    // Calculate cycle time (average days from creation to completion)
    const completedTasks = tasks.filter((t) => t.getStatus().getValue() === 'done');
    const cycleTimes: number[] = [];

    completedTasks.forEach((task) => {
      const createdAt = task.getCreatedAt();
      const updatedAt = task.getUpdatedAt();
      const cycleTime = (updatedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
      cycleTimes.push(cycleTime);
    });

    const averageCycleTime =
      cycleTimes.length > 0 ? cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length : 0;

    return {
      sprintId: query.sprintId,
      sprintName: sprint.getName(),
      status: sprint.getStatus().getValue(),
      storyPointsCommitted,
      storyPointsCompleted,
      velocity,
      completionRate:
        storyPointsCommitted > 0
          ? Math.round((storyPointsCompleted / storyPointsCommitted) * 100)
          : 0,
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      averageCycleTime: Math.round(averageCycleTime * 100) / 100,
      startDate: sprint.getStartDate(),
      endDate: sprint.getEndDate(),
    };
  }
}
