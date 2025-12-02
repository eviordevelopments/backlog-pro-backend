import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { CreateTransactionCommandHandler } from '@finances/application/commands/create-transaction.command-handler';
import { CreateTransactionCommand } from '@finances/application/commands/create-transaction.command';
import { GetProjectExpensesQueryHandler } from '@finances/application/queries/get-project-expenses.query-handler';
import { GetProjectExpensesQuery } from '@finances/application/queries/get-project-expenses.query';
import { ListTransactionsQueryHandler } from '@finances/application/queries/list-transactions.query-handler';
import { ListTransactionsQuery } from '@finances/application/queries/list-transactions.query';
import { CreateTransactionDto } from '@finances/dto/request/create-transaction.dto';
import { TransactionResponseDto } from '@finances/dto/response/transaction.response.dto';

@Resolver('Transaction')
export class TransactionResolver {
  constructor(
    private readonly createTransactionHandler: CreateTransactionCommandHandler,
    private readonly getProjectExpensesHandler: GetProjectExpensesQueryHandler,
    private readonly listTransactionsHandler: ListTransactionsQueryHandler,
  ) {}

  @Mutation(() => TransactionResponseDto)
  @UseGuards(JwtAuthGuard)
  async createTransaction(
    @Args('input') input: CreateTransactionDto
  ): Promise<TransactionResponseDto> {
    const command = new CreateTransactionCommand(
      input.type,
      input.category,
      input.amount,
      input.currency,
      input.date,
      input.description,
      input.clientId,
      input.projectId,
      input.isRecurring,
      input.recurringFrequency
    );

    const transaction = await this.createTransactionHandler.handle(command);

    return {
      id: transaction.getId(),
      type: transaction.getType().getValue(),
      category: transaction.getCategory(),
      amount: transaction.getAmount().getValue(),
      currency: transaction.getCurrency().getValue(),
      date: transaction.getDate(),
      description: transaction.getDescription(),
      clientId: transaction.getClientId() ?? undefined,
      projectId: transaction.getProjectId() ?? undefined,
      isRecurring: transaction.isRecurringTransaction(),
      recurringFrequency: transaction.getRecurringFrequency() ?? undefined,
      createdAt: transaction.getCreatedAt(),
      updatedAt: transaction.getUpdatedAt(),
    };
  }

  @Query(() => [TransactionResponseDto])
  @UseGuards(JwtAuthGuard)
  async getProjectExpenses(
    @Args('projectId') projectId: string
  ): Promise<TransactionResponseDto[]> {
    const query = new GetProjectExpensesQuery(projectId);
    const expenses = await this.getProjectExpensesHandler.handle(query);
    return (Object.values(expenses).flat() as TransactionResponseDto[]);
  }

  @Query(() => [TransactionResponseDto])
  @UseGuards(JwtAuthGuard)
  async listTransactions(
    @Args('clientId', { nullable: true }) clientId?: string,
    @Args('projectId', { nullable: true }) projectId?: string
  ): Promise<TransactionResponseDto[]> {
    const query = new ListTransactionsQuery({ clientId, projectId });
    return this.listTransactionsHandler.handle(query);
  }
}
