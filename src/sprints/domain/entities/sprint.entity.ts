import { v4 as uuid } from 'uuid';

import { SprintStatus } from '../value-objects/sprint-status.vo';

export class Sprint {
  private id: string;
  private name: string;
  private projectId: string;
  private goal: string;
  private startDate: Date;
  private endDate: Date;
  private status: SprintStatus;
  private velocity: number;
  private storyPointsCommitted: number;
  private storyPointsCompleted: number;
  private teamMembers: string[];
  private sprintPlanningDate: Date | null;
  private sprintReviewDate: Date | null;
  private sprintRetrospectiveDate: Date | null;
  private dailyStandupTime: string;
  private retrospectiveNotes: string | null;
  private createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;

  constructor(
    name: string,
    projectId: string,
    goal: string,
    startDate: Date,
    endDate: Date,
    dailyStandupTime: string = '09:00',
    id?: string,
    status?: SprintStatus,
    velocity?: number,
    storyPointsCommitted?: number,
    storyPointsCompleted?: number,
    teamMembers?: string[],
    sprintPlanningDate?: Date | null,
    sprintReviewDate?: Date | null,
    sprintRetrospectiveDate?: Date | null,
    retrospectiveNotes?: string | null,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    this.id = id || uuid();
    this.name = name;
    this.projectId = projectId;
    this.goal = goal;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status || SprintStatus.PLANNING;
    this.velocity = velocity || 0;
    this.storyPointsCommitted = storyPointsCommitted || 0;
    this.storyPointsCompleted = storyPointsCompleted || 0;
    this.teamMembers = teamMembers || [];
    this.sprintPlanningDate = sprintPlanningDate || null;
    this.sprintReviewDate = sprintReviewDate || null;
    this.sprintRetrospectiveDate = sprintRetrospectiveDate || null;
    this.dailyStandupTime = dailyStandupTime;
    this.retrospectiveNotes = retrospectiveNotes || null;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.deletedAt = deletedAt || null;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getProjectId(): string {
    return this.projectId;
  }

  getGoal(): string {
    return this.goal;
  }

  getStartDate(): Date {
    return this.startDate;
  }

  getEndDate(): Date {
    return this.endDate;
  }

  getStatus(): SprintStatus {
    return this.status;
  }

  getVelocity(): number {
    return this.velocity;
  }

  getStoryPointsCommitted(): number {
    return this.storyPointsCommitted;
  }

  getStoryPointsCompleted(): number {
    return this.storyPointsCompleted;
  }

  getTeamMembers(): string[] {
    return this.teamMembers;
  }

  getSprintPlanningDate(): Date | null {
    return this.sprintPlanningDate;
  }

  getSprintReviewDate(): Date | null {
    return this.sprintReviewDate;
  }

  getSprintRetrospectiveDate(): Date | null {
    return this.sprintRetrospectiveDate;
  }

  getDailyStandupTime(): string {
    return this.dailyStandupTime;
  }

  getRetrospectiveNotes(): string | null {
    return this.retrospectiveNotes;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getDeletedAt(): Date | null {
    return this.deletedAt;
  }

  setName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }

  setGoal(goal: string): void {
    this.goal = goal;
    this.updatedAt = new Date();
  }

  setStatus(status: SprintStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  setVelocity(velocity: number): void {
    this.velocity = velocity;
    this.updatedAt = new Date();
  }

  setStoryPointsCommitted(points: number): void {
    this.storyPointsCommitted = points;
    this.updatedAt = new Date();
  }

  setStoryPointsCompleted(points: number): void {
    this.storyPointsCompleted = points;
    this.updatedAt = new Date();
  }

  setTeamMembers(members: string[]): void {
    this.teamMembers = members;
    this.updatedAt = new Date();
  }

  setSprintPlanningDate(date: Date): void {
    this.sprintPlanningDate = date;
    this.updatedAt = new Date();
  }

  setSprintReviewDate(date: Date): void {
    this.sprintReviewDate = date;
    this.updatedAt = new Date();
  }

  setSprintRetrospectiveDate(date: Date): void {
    this.sprintRetrospectiveDate = date;
    this.updatedAt = new Date();
  }

  setRetrospectiveNotes(notes: string): void {
    this.retrospectiveNotes = notes;
    this.updatedAt = new Date();
  }

  setDeletedAt(date: Date | null): void {
    this.deletedAt = date;
    this.updatedAt = new Date();
  }
}
