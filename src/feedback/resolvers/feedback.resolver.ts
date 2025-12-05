import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CreateFeedbackCommand } from '../application/commands/create-feedback.command';
import { CreateFeedbackCommandHandler } from '../application/commands/create-feedback.command-handler';
import { GetUserFeedbackQuery } from '../application/queries/get-user-feedback.query';
import { GetUserFeedbackQueryHandler } from '../application/queries/get-user-feedback.query-handler';
import { CreateFeedbackDto } from '../dto/request/create-feedback.dto';
import { FeedbackResponseDto } from '../dto/response/feedback.response.dto';

@Resolver('Feedback')
export class FeedbackResolver {
  constructor(
    private readonly createFeedbackHandler: CreateFeedbackCommandHandler,
    private readonly getUserFeedbackHandler: GetUserFeedbackQueryHandler,
  ) {}

  @Mutation(() => FeedbackResponseDto)
  @UseGuards(JwtAuthGuard)
  async sendFeedback(
    @CurrentUser() currentUser: { sub: string; email: string },
    @Args('input') input: CreateFeedbackDto,
  ): Promise<FeedbackResponseDto> {
    const command = new CreateFeedbackCommand(
      currentUser.sub,
      input.toUserId,
      input.type,
      input.category,
      input.rating,
      input.comment,
      input.isAnonymous,
      input.sprintId,
    );

    const feedback = await this.createFeedbackHandler.handle(command);

    return {
      id: feedback.getId(),
      fromUserId: feedback.isAnon() ? undefined : feedback.getFromUserId(),
      toUserId: feedback.getToUserId(),
      type: feedback.getType(),
      category: feedback.getCategory(),
      rating: feedback.getRating(),
      comment: feedback.getComment(),
      sprintId: feedback.getSprintId(),
      isAnonymous: feedback.isAnon(),
      createdAt: feedback.getCreatedAt(),
      updatedAt: feedback.getUpdatedAt(),
    };
  }

  @Query(() => [FeedbackResponseDto])
  @UseGuards(JwtAuthGuard)
  async getUserFeedback(
    @CurrentUser() currentUser: { sub: string; email: string },
  ): Promise<FeedbackResponseDto[]> {
    const query = new GetUserFeedbackQuery(currentUser.sub);
    return this.getUserFeedbackHandler.handle(query);
  }
}
