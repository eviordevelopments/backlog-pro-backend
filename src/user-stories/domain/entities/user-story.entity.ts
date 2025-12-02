import { v4 as uuid } from 'uuid';

export interface AcceptanceCriteria {
  id: string;
  description: string;
  completed: boolean;
}

export class UserStory {
  private id: string;
  private projectId: string;
  private sprintId: string | null;
  private title: string;
  private userType: string;
  private action: string;
  private benefit: string;
  private acceptanceCriteria: AcceptanceCriteria[];
  private storyPoints: number;
  private priority: string; // 'low', 'medium', 'high', 'critical'
  private status: string; // 'backlog', 'ready', 'in_progress', 'done', 'cancelled'
  private assignedTo: string | null;
  private definitionOfDone: string;
  private impactMetrics: string;
  private createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;

  constructor(
    projectId: string,
    title: string,
    userType: string,
    action: string,
    benefit: string,
    priority: string,
    sprintId?: string | null,
    acceptanceCriteria?: AcceptanceCriteria[],
    storyPoints?: number,
    status?: string,
    assignedTo?: string | null,
    definitionOfDone?: string,
    impactMetrics?: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    this.id = id || uuid();
    this.projectId = projectId;
    this.sprintId = sprintId || null;
    this.title = title;
    this.userType = userType;
    this.action = action;
    this.benefit = benefit;
    this.acceptanceCriteria = acceptanceCriteria || [];
    this.storyPoints = storyPoints || 0;
    this.priority = priority;
    this.status = status || 'backlog';
    this.assignedTo = assignedTo || null;
    this.definitionOfDone = definitionOfDone || '';
    this.impactMetrics = impactMetrics || '';
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.deletedAt = deletedAt || null;
  }

  getId(): string {
    return this.id;
  }

  getProjectId(): string {
    return this.projectId;
  }

  getSprintId(): string | null {
    return this.sprintId;
  }

  getTitle(): string {
    return this.title;
  }

  getUserType(): string {
    return this.userType;
  }

  getAction(): string {
    return this.action;
  }

  getBenefit(): string {
    return this.benefit;
  }

  getAcceptanceCriteria(): AcceptanceCriteria[] {
    return this.acceptanceCriteria;
  }

  getStoryPoints(): number {
    return this.storyPoints;
  }

  getPriority(): string {
    return this.priority;
  }

  getStatus(): string {
    return this.status;
  }

  getAssignedTo(): string | null {
    return this.assignedTo;
  }

  getDefinitionOfDone(): string {
    return this.definitionOfDone;
  }

  getImpactMetrics(): string {
    return this.impactMetrics;
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

  setSprintId(sprintId: string | null): void {
    this.sprintId = sprintId;
    if (sprintId) {
      this.status = 'ready';
    }
    this.updatedAt = new Date();
  }

  setStoryPoints(points: number): void {
    this.storyPoints = points;
    this.updatedAt = new Date();
  }

  setStatus(status: string): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  setAssignedTo(userId: string | null): void {
    this.assignedTo = userId;
    this.updatedAt = new Date();
  }

  addAcceptanceCriteria(description: string): void {
    this.acceptanceCriteria.push({
      id: uuid(),
      description,
      completed: false,
    });
    this.updatedAt = new Date();
  }

  completeAcceptanceCriteria(criteriaId: string): void {
    const criteria = this.acceptanceCriteria.find((c) => c.id === criteriaId);
    if (criteria) {
      criteria.completed = true;
      this.updatedAt = new Date();
    }
  }

  setDeletedAt(date: Date | null): void {
    this.deletedAt = date;
    this.updatedAt = new Date();
  }
}
