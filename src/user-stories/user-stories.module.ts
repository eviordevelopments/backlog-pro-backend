import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStoryTypeOrmEntity } from '@user-stories/repository/entities/user-story.typeorm-entity';
import { UserStoryRepository } from '@user-stories/repository/user-story.repository';
import { UserStoryMapper } from '@user-stories/repository/mappers/user-story.mapper';
import { CreateUserStoryCommandHandler } from '@user-stories/application/commands/create-user-story.command-handler';
import { GetProjectBacklogQueryHandler } from '@user-stories/application/queries/get-project-backlog.query-handler';
import { UserStoryResolver } from '@user-stories/resolvers/user-story.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UserStoryTypeOrmEntity])],
  providers: [
    UserStoryRepository,
    UserStoryMapper,
    CreateUserStoryCommandHandler,
    GetProjectBacklogQueryHandler,
    UserStoryResolver,
  ],
  exports: [UserStoryRepository, CreateUserStoryCommandHandler],
})
export class UserStoriesModule {}
