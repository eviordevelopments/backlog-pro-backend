export interface MemberAssignment {
  userId: string;
  role: string; // 'owner', 'lead', 'developer', 'viewer'
}

export class AssignMembersCommand {
  constructor(
    public readonly projectId: string,
    public readonly members: MemberAssignment[],
  ) {}
}
