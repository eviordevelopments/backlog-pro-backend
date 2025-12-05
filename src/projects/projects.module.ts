import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssignMembersCommandHandler } from './application/commands/assign-members.command-handler';
import { ProjectService } from './application/services/project.service';
import { ProjectMemberTypeOrmEntity } from './repository/entities/project-member.typeorm-entity';
import { ProjectTypeOrmEntity } from './repository/entities/project.typeorm-entity';
import { ProjectMemberRepository } from './repository/project-member.repository';
import { ProjectRepository } from './repository/project.repository';
import { ProjectResolver } from './resolvers/project.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectTypeOrmEntity, ProjectMemberTypeOrmEntity])],
  providers: [
    ProjectRepository,
    ProjectMemberRepository,
    ProjectService,
    ProjectResolver,
    AssignMembersCommandHandler,
  ],
  exports: [ProjectRepository, ProjectMemberRepository, ProjectService],
})
export class ProjectsModule {}
