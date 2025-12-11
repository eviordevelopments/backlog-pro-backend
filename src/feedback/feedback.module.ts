import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateFeedbackCommandHandler } from './application/commands/create-feedback.command-handler';
import { DeleteFeedbackCommandHandler } from './application/commands/delete-feedback.command-handler';
import { UpdateFeedbackCommandHandler } from './application/commands/update-feedback.command-handler';
import { GetUserFeedbackQueryHandler } from './application/queries/get-user-feedback.query-handler';
import { FeedbackTypeOrmEntity } from './repository/entities/feedback.typeorm-entity';
import { FeedbackRepository } from './repository/feedback.repository';
import { FeedbackMapper } from './repository/mappers/feedback.mapper';
import { FeedbackResolver } from './resolvers/feedback.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackTypeOrmEntity])],
  providers: [
    FeedbackRepository,
    FeedbackMapper,
    CreateFeedbackCommandHandler,
    UpdateFeedbackCommandHandler,
    DeleteFeedbackCommandHandler,
    GetUserFeedbackQueryHandler,
    FeedbackResolver,
  ],
  exports: [FeedbackRepository, CreateFeedbackCommandHandler],
})
export class FeedbackModule {}
