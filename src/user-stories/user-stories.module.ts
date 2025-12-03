import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateUserStoryCommandHandler } from './application/commands/create-user-story.command-handler';
import { GetProjectBacklogQueryHandler } from './application/queries/get-project-backlog.query-handler';
import { UserStoryTypeOrmEntity } from './repository/entities/user-story.typeorm-entity';
import { UserStoryMapper } from './repository/mappers/user-story.mapper';
import { UserStoryRepository } from './repository/user-story.repository';
import { UserStoryResolver } from './resolvers/user-story.resolver';

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
