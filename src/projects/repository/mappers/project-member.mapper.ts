import { ProjectMember } from '@projects/domain/entities/project-member.entity';
import { ProjectMemberTypeOrmEntity } from '@projects/repository/entities/project-member.typeorm-entity';

export class ProjectMemberMapper {
  static toDomain(raw: ProjectMemberTypeOrmEntity): ProjectMember {
    return new ProjectMember({
      id: raw.id,
      projectId: raw.projectId,
      userId: raw.userId,
      role: raw.role,
      joinedAt: raw.joinedAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  static toPersistence(projectMember: ProjectMember): ProjectMemberTypeOrmEntity {
    const entity = new ProjectMemberTypeOrmEntity();
    entity.id = projectMember.id;
    entity.projectId = projectMember.projectId;
    entity.userId = projectMember.userId;
    entity.role = projectMember.role;
    entity.joinedAt = projectMember.joinedAt;
    entity.createdAt = projectMember.createdAt;
    entity.updatedAt = projectMember.updatedAt;
    entity.deletedAt = projectMember.deletedAt;
    return entity;
  }
}
