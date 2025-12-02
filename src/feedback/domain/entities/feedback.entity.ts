import { v4 as uuid } from 'uuid';

export class Feedback {
  private id: string;
  private fromUserId: string;
  private toUserId: string;
  private type: string; // 'positive', 'constructive', 'neutral'
  private category: string; // 'technical', 'communication', 'teamwork', 'leadership'
  private rating: number; // 1-5
  private comment: string;
  private sprintId: string | null;
  private isAnonymous: boolean;
  private createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;

  constructor(
    fromUserId: string,
    toUserId: string,
    type: string,
    category: string,
    rating: number,
    comment: string,
    isAnonymous: boolean,
    sprintId?: string | null,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    this.id = id || uuid();
    this.fromUserId = fromUserId;
    this.toUserId = toUserId;
    this.type = type;
    this.category = category;
    this.rating = rating;
    this.comment = comment;
    this.sprintId = sprintId || null;
    this.isAnonymous = isAnonymous;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.deletedAt = deletedAt || null;
  }

  getId(): string {
    return this.id;
  }

  getFromUserId(): string {
    return this.fromUserId;
  }

  getToUserId(): string {
    return this.toUserId;
  }

  getType(): string {
    return this.type;
  }

  getCategory(): string {
    return this.category;
  }

  getRating(): number {
    return this.rating;
  }

  getComment(): string {
    return this.comment;
  }

  getSprintId(): string | null {
    return this.sprintId;
  }

  isAnon(): boolean {
    return this.isAnonymous;
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

  setComment(comment: string): void {
    this.comment = comment;
    this.updatedAt = new Date();
  }

  setRating(rating: number): void {
    this.rating = rating;
    this.updatedAt = new Date();
  }

  setDeletedAt(date: Date | null): void {
    this.deletedAt = date;
    this.updatedAt = new Date();
  }
}
