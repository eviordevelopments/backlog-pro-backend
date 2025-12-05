import { v4 as uuid } from 'uuid';

import { TaskPriority } from '../value-objects/task-priority.vo';
import { TaskStatus } from '../value-objects/task-status.vo';

export class Task {
  private id: string;
  private title: string;
  private description: string;
  private projectId: string;
  private sprintId: string | null;
  private status: TaskStatus;
  private priority: TaskPriority;
  private assignedTo: string | null;
  private estimatedHours: number;
  private actualHours: number;
  private storyPoints: number;
  private dueDate: Date | null;
  private tags: string[];
  private dependencies: string[];
  private subtasks: string[];
  private createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;

  constructor(
    title: string,
    projectId: string,
    description: string = '',
    id?: string,
    sprintId?: string | null,
    status?: TaskStatus,
    priority?: TaskPriority,
    assignedTo?: string | null,
    estimatedHours?: number,
    actualHours?: number,
    storyPoints?: number,
    dueDate?: Date | null,
    tags?: string[],
    dependencies?: string[],
    subtasks?: string[],
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    this.id = id || uuid();
    this.title = title;
    this.projectId = projectId;
    this.description = description;
    this.sprintId = sprintId || null;
    this.status = status || TaskStatus.TODO;
    this.priority = priority || TaskPriority.MEDIUM;
    this.assignedTo = assignedTo || null;
    this.estimatedHours = estimatedHours || 0;
    this.actualHours = actualHours || 0;
    this.storyPoints = storyPoints || 0;
    this.dueDate = dueDate || null;
    this.tags = tags || [];
    this.dependencies = dependencies || [];
    this.subtasks = subtasks || [];
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.deletedAt = deletedAt || null;
  }

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getDescription(): string {
    return this.description;
  }

  getProjectId(): string {
    return this.projectId;
  }

  getSprintId(): string | null {
    return this.sprintId;
  }

  getStatus(): TaskStatus {
    return this.status;
  }

  getPriority(): TaskPriority {
    return this.priority;
  }

  getAssignedTo(): string | null {
    return this.assignedTo;
  }

  getEstimatedHours(): number {
    return this.estimatedHours;
  }

  getActualHours(): number {
    return this.actualHours;
  }

  getStoryPoints(): number {
    return this.storyPoints;
  }

  getDueDate(): Date | null {
    return this.dueDate;
  }

  getTags(): string[] {
    return this.tags;
  }

  getDependencies(): string[] {
    return this.dependencies;
  }

  getSubtasks(): string[] {
    return this.subtasks;
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

  setTitle(title: string): void {
    this.title = title;
    this.updatedAt = new Date();
  }

  setDescription(description: string): void {
    this.description = description;
    this.updatedAt = new Date();
  }

  setSprintId(sprintId: string | null): void {
    this.sprintId = sprintId;
    this.updatedAt = new Date();
  }

  setStatus(status: TaskStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  setPriority(priority: TaskPriority): void {
    this.priority = priority;
    this.updatedAt = new Date();
  }

  setAssignedTo(assignedTo: string | null): void {
    this.assignedTo = assignedTo;
    this.updatedAt = new Date();
  }

  setEstimatedHours(hours: number): void {
    this.estimatedHours = hours;
    this.updatedAt = new Date();
  }

  setActualHours(hours: number): void {
    this.actualHours = hours;
    this.updatedAt = new Date();
  }

  setStoryPoints(points: number): void {
    this.storyPoints = points;
    this.updatedAt = new Date();
  }

  setDueDate(dueDate: Date | null): void {
    this.dueDate = dueDate;
    this.updatedAt = new Date();
  }

  setTags(tags: string[]): void {
    this.tags = tags;
    this.updatedAt = new Date();
  }

  setDependencies(dependencies: string[]): void {
    this.dependencies = dependencies;
    this.updatedAt = new Date();
  }

  setSubtasks(subtasks: string[]): void {
    this.subtasks = subtasks;
    this.updatedAt = new Date();
  }

  setDeletedAt(date: Date | null): void {
    this.deletedAt = date;
    this.updatedAt = new Date();
  }

  addDependency(taskId: string): void {
    if (!this.dependencies.includes(taskId)) {
      this.dependencies.push(taskId);
      this.updatedAt = new Date();
    }
  }

  removeDependency(taskId: string): void {
    this.dependencies = this.dependencies.filter((id) => id !== taskId);
    this.updatedAt = new Date();
  }

  addSubtask(subtask: string): void {
    this.subtasks.push(subtask);
    this.updatedAt = new Date();
  }

  addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date();
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter((t) => t !== tag);
    this.updatedAt = new Date();
  }
}
