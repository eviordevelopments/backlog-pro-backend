export class UserProfile {
  id!: string;
  userId!: string;
  name!: string;
  email!: string;
  avatar?: string;
  skills?: string[];
  hourlyRate?: number;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  constructor(
    userId?: string,
    name?: string,
    email?: string,
    avatar?: string,
    skills?: string[],
    hourlyRate?: number,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date,
  ) {
    this.id = id || '';
    this.userId = userId || '';
    this.name = name || '';
    this.email = email || '';
    this.avatar = avatar;
    this.skills = skills;
    this.hourlyRate = hourlyRate;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.deletedAt = deletedAt;
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getAvatar(): string | undefined {
    return this.avatar;
  }

  getSkills(): string[] | undefined {
    return this.skills;
  }

  getHourlyRate(): number | undefined {
    return this.hourlyRate;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getDeletedAt(): Date | undefined {
    return this.deletedAt;
  }

  updateProfile(data: Partial<UserProfile>): void {
    if (data.name) this.name = data.name;
    if (data.avatar !== undefined) this.avatar = data.avatar;
    if (data.skills !== undefined) this.skills = data.skills;
    if (data.hourlyRate !== undefined) this.hourlyRate = data.hourlyRate;
    this.updatedAt = new Date();
  }
}
