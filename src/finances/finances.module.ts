import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionTypeOrmEntity } from '@finances/repository/entities/transaction.typeorm-entity';
import { InvoiceTypeOrmEntity } from '@finances/repository/entities/invoice.typeorm-entity';
import { TransactionRepository } from '@finances/repository/transaction.repository';
import { InvoiceRepository } from '@finances/repository/invoice.repository';
import { TransactionMapper } from '@finances/repository/mappers/transaction.mapper';
import { InvoiceMapper } from '@finances/repository/mappers/invoice.mapper';
import { CreateTransactionCommandHandler } from '@finances/application/commands/create-transaction.command-handler';
import { CreateInvoiceCommandHandler } from '@finances/application/commands/create-invoice.command-handler';
import { GetProjectExpensesQueryHandler } from '@finances/application/queries/get-project-expenses.query-handler';
import { ListTransactionsQueryHandler } from '@finances/application/queries/list-transactions.query-handler';
import { CalculateIdealHourlyRateQueryHandler } from '@finances/application/queries/calculate-ideal-hourly-rate.query-handler';
import { CalculateSalariesQueryHandler } from '@finances/application/queries/calculate-salaries.query-handler';
import { GenerateFinancialReportQueryHandler } from '@finances/application/queries/generate-financial-report.query-handler';
import { TransactionResolver } from '@finances/resolvers/transaction.resolver';
import { InvoiceResolver } from '@finances/resolvers/invoice.resolver';
import { SalaryResolver } from '@finances/resolvers/salary.resolver';
import { ProjectsModule } from '@projects/projects.module';
import { TimeEntriesModule } from '@time-entries/time-entries.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionTypeOrmEntity, InvoiceTypeOrmEntity]),
    ProjectsModule,
    TimeEntriesModule,
    UsersModule,
  ],
  providers: [
    TransactionRepository,
    InvoiceRepository,
    TransactionMapper,
    InvoiceMapper,
    CreateTransactionCommandHandler,
    CreateInvoiceCommandHandler,
    GetProjectExpensesQueryHandler,
    ListTransactionsQueryHandler,
    CalculateIdealHourlyRateQueryHandler,
    CalculateSalariesQueryHandler,
    GenerateFinancialReportQueryHandler,
    TransactionResolver,
    InvoiceResolver,
    SalaryResolver,
  ],
  exports: [
    TransactionRepository,
    InvoiceRepository,
    CreateTransactionCommandHandler,
    CreateInvoiceCommandHandler,
  ],
})
export class FinancesModule {}
