import { v4 as uuid } from 'uuid';

export interface RiskComment {
  userId: string;
  comment: string;
  timestamp: Date;
}

export class Risk {
  private id: string;
  private projectId: string;
  private title: string;
  private description: string;
  private category: string;
  private probability: string; // 'low', 'medium', 'high', 'critical'
  private impact: string; // 'low', 'medium', 'high', 'critical'
  private mitigationStrategy: string;
  private responsibleId: string;
  private status: string; // 'identified', 'mitigating', 'resolved', 'closed'
  private isCore: boolean;
  private comments: RiskComment[];
  private createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;

  constructor(
    projectId: string,
    title: string,
    category: string,
    probability: string,
    impact: string,
    responsibleId: string,
    description?: string,
    mitigationStrategy?: string,
    isCore?: boolean,
    status?: string,
    comments?: RiskComment[],
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    this.id = id || uuid();
    this.projectId = projectId;
    this.title = title;
    this.description = description || '';
    this.category = category;
    this.probability = probability;
    this.impact = impact;
    this.mitigationStrategy = mitigationStrategy || '';
    this.responsibleId = responsibleId;
    this.status = status || 'identified';
    this.isCore = isCore || false;
    this.comments = comments || [];
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

  getTitle(): string {
    return this.title;
  }

  getDescription(): string {
    return this.description;
  }

  getCategory(): string {
    return this.category;
  }

  getProbability(): string {
    return this.probability;
  }

  getImpact(): string {
    return this.impact;
  }

  getMitigationStrategy(): string {
    return this.mitigationStrategy;
  }

  getResponsibleId(): string {
    return this.responsibleId;
  }

  getStatus(): string {
    return this.status;
  }

  isCorRisk(): boolean {
    return this.isCore;
  }

  getComments(): RiskComment[] {
    return this.comments;
  }

  getSeverity(): number {
    const probabilityMap: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 };
    const impactMap: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 };
    return (probabilityMap[this.probability] || 0) * (impactMap[this.impact] || 0);
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

  setMitigationStrategy(strategy: string): void {
    this.mitigationStrategy = strategy;
    this.updatedAt = new Date();
  }

  setStatus(status: string): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  addComment(userId: string, comment: string): void {
    this.comments.push({
      userId,
      comment,
      timestamp: new Date(),
    });
    this.updatedAt = new Date();
  }

  setDeletedAt(date: Date | null): void {
    this.deletedAt = date;
    this.updatedAt = new Date();
  }
}
