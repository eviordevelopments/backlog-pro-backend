import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CreateTransactionCommand } from '../application/commands/create-transaction.command';
import { CreateTransactionCommandHandler } from '../application/commands/create-transaction.command-handler';
import { GetProjectExpensesQuery } from '../application/queries/get-project-expenses.query';
import { GetProjectExpensesQueryHandler } from '../application/queries/get-project-expenses.query-handler';
import { ListTransactionsQuery } from '../application/queries/list-transactions.query';
import { ListTransactionsQueryHandler } from '../application/queries/list-transactions.query-handler';
import { CreateTransactionDto } from '../dto/request/create-transaction.dto';
import { TransactionResponseDto } from '../dto/response/transaction.response.dto';

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
    @Args('input') input: CreateTransactionDto,
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
      input.recurringFrequency,
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
    @Args('projectId') projectId: string,
  ): Promise<TransactionResponseDto[]> {
    const query = new GetProjectExpensesQuery(projectId);
    const expenses = await this.getProjectExpensesHandler.handle(query);
    return Object.values(expenses).flat();
  }

  @Query(() => [TransactionResponseDto])
  @UseGuards(JwtAuthGuard)
  async listTransactions(
    @Args('clientId', { nullable: true }) clientId?: string,
    @Args('projectId', { nullable: true }) projectId?: string,
  ): Promise<TransactionResponseDto[]> {
    const query = new ListTransactionsQuery({ clientId, projectId });
    return this.listTransactionsHandler.handle(query);
  }
}
