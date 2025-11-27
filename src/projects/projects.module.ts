import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectTypeOrmEntity } from './repository/entities/project.typeorm-entity';
import { ProjectMemberTypeOrmEntity } from './repository/entities/project-member.typeorm-entity';
import { ProjectRepository } from './repository/project.repository';
import { ProjectMemberRepository } from './repository/project-member.repository';
import { ProjectService } from './application/services/project.service';
import { ProjectResolver } from './resolvers/project.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectTypeOrmEntity, ProjectMemberTypeOrmEntity])],
  providers: [ProjectRepository, ProjectMemberRepository, ProjectService, ProjectResolver],
  exports: [ProjectRepository, ProjectMemberRepository, ProjectService],
})
export class ProjectsModule {}
