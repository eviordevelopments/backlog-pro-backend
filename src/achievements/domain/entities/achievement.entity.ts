import { v4 as uuid } from 'uuid';

export class Achievement {
  private id: string;
  private name: string;
  private description: string;
  private icon: string;
  private category: string; // 'productivity', 'collaboration', 'quality', 'leadership'
  private points: number;
  private rarity: string; // 'common', 'uncommon', 'rare', 'epic', 'legendary'
  private requirement: string; // Description of what's needed to unlock
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    name: string,
    description: string,
    icon: string,
    category: string,
    points: number,
    rarity: string,
    requirement: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id || uuid();
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.category = category;
    this.points = points;
    this.rarity = rarity;
    this.requirement = requirement;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getIcon(): string {
    return this.icon;
  }

  getCategory(): string {
    return this.category;
  }

  getPoints(): number {
    return this.points;
  }

  getRarity(): string {
    return this.rarity;
  }

  getRequirement(): string {
    return this.requirement;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  setName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }

  setDescription(description: string): void {
    this.description = description;
    this.updatedAt = new Date();
  }
}

export class UserAchievement {
  private id: string;
  private userId: string;
  private achievementId: string;
  private unlockedAt: Date;
  private createdAt: Date;

  constructor(
    userId: string,
    achievementId: string,
    unlockedAt?: Date,
    id?: string,
    createdAt?: Date,
  ) {
    this.id = id || uuid();
    this.userId = userId;
    this.achievementId = achievementId;
    this.unlockedAt = unlockedAt || new Date();
    this.createdAt = createdAt || new Date();
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getAchievementId(): string {
    return this.achievementId;
  }

  getUnlockedAt(): Date {
    return this.unlockedAt;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
