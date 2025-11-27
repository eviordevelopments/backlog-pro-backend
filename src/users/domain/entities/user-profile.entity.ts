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

  constructor(data: Partial<UserProfile>) {
    Object.assign(this, data);
  }

  updateProfile(data: Partial<UserProfile>): void {
    if (data.name) this.name = data.name;
    if (data.avatar !== undefined) this.avatar = data.avatar;
    if (data.skills !== undefined) this.skills = data.skills;
    if (data.hourlyRate !== undefined) this.hourlyRate = data.hourlyRate;
    this.updatedAt = new Date();
  }
}
