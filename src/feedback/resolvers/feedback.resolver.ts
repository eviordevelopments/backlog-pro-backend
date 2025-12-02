import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { CreateFeedbackCommandHandler } from '@feedback/application/commands/create-feedback.command-handler';
import { CreateFeedbackCommand } from '@feedback/application/commands/create-feedback.command';
import { GetUserFeedbackQueryHandler } from '@feedback/application/queries/get-user-feedback.query-handler';
import { GetUserFeedbackQuery } from '@feedback/application/queries/get-user-feedback.query';
import { CreateFeedbackDto } from '@feedback/dto/request/create-feedback.dto';
import { FeedbackResponseDto } from '@feedback/dto/response/feedback.response.dto';

@Resolver('Feedback')
export class FeedbackResolver {
  constructor(
    private readonly createFeedbackHandler: CreateFeedbackCommandHandler,
    private readonly getUserFeedbackHandler: GetUserFeedbackQueryHandler,
  ) {}

  @Mutation(() => FeedbackResponseDto)
  @UseGuards(JwtAuthGuard)
  async sendFeedback(
    @CurrentUser() currentUser: any,
    @Args('input') input: CreateFeedbackDto
  ): Promise<FeedbackResponseDto> {
    const command = new CreateFeedbackCommand(
      currentUser.id,
      input.toUserId,
      input.type,
      input.category,
      input.rating,
      input.comment,
      input.isAnonymous,
      input.sprintId
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
    @CurrentUser() currentUser: any
  ): Promise<FeedbackResponseDto[]> {
    const query = new GetUserFeedbackQuery(currentUser.id);
    return this.getUserFeedbackHandler.handle(query);
  }
}
