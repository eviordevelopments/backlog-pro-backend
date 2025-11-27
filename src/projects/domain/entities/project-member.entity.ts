export class ProjectMember {
  id!: string;
  projectId!: string;
  userId!: string;
  role!: string; // 'owner', 'lead', 'developer', 'viewer'
  joinedAt!: Date;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  constructor(data: Partial<ProjectMember>) {
    Object.assign(this, data);
  }

  isOwner(): boolean {
    return this.role === 'owner';
  }

  isLead(): boolean {
    return this.role === 'lead';
  }

  isDeveloper(): boolean {
    return this.role === 'developer';
  }

  canEdit(): boolean {
    return this.role === 'owner' || this.role === 'lead';
  }
}
