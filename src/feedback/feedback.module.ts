import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackTypeOrmEntity } from '@feedback/repository/entities/feedback.typeorm-entity';
import { FeedbackRepository } from '@feedback/repository/feedback.repository';
import { FeedbackMapper } from '@feedback/repository/mappers/feedback.mapper';
import { CreateFeedbackCommandHandler } from '@feedback/application/commands/create-feedback.command-handler';
import { GetUserFeedbackQueryHandler } from '@feedback/application/queries/get-user-feedback.query-handler';
import { FeedbackResolver } from '@feedback/resolvers/feedback.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackTypeOrmEntity])],
  providers: [
    FeedbackRepository,
    FeedbackMapper,
    CreateFeedbackCommandHandler,
    GetUserFeedbackQueryHandler,
    FeedbackResolver,
  ],
  exports: [FeedbackRepository, CreateFeedbackCommandHandler],
})
export class FeedbackModule {}
