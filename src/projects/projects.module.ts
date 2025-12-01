import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectTypeOrmEntity } from '@projects/repository/entities/project.typeorm-entity';
import { ProjectMemberTypeOrmEntity } from '@projects/repository/entities/project-member.typeorm-entity';
import { ProjectRepository } from '@projects/repository/project.repository';
import { ProjectMemberRepository } from '@projects/repository/project-member.repository';
import { ProjectService } from '@projects/application/services/project.service';
import { ProjectResolver } from '@projects/resolvers/project.resolver';
import { AssignMembersCommandHandler } from '@projects/application/commands/assign-members.command-handler';

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
