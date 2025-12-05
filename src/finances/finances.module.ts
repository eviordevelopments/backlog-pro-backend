import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { ProjectsModule } from '../projects/projects.module';
import { TimeEntriesModule } from '../time-entries/time-entries.module';
import { UsersModule } from '../users/users.module';

import { CreateInvoiceCommandHandler } from './application/commands/create-invoice.command-handler';
import { CreateTransactionCommandHandler } from './application/commands/create-transaction.command-handler';
import { CalculateIdealHourlyRateQueryHandler } from './application/queries/calculate-ideal-hourly-rate.query-handler';
import { CalculateSalariesQueryHandler } from './application/queries/calculate-salaries.query-handler';
import { GenerateFinancialReportQueryHandler } from './application/queries/generate-financial-report.query-handler';
import { GetProjectExpensesQueryHandler } from './application/queries/get-project-expenses.query-handler';
import { ListTransactionsQueryHandler } from './application/queries/list-transactions.query-handler';
import { InvoiceTypeOrmEntity } from './repository/entities/invoice.typeorm-entity';
import { TransactionTypeOrmEntity } from './repository/entities/transaction.typeorm-entity';
import { InvoiceRepository } from './repository/invoice.repository';
import { InvoiceMapper } from './repository/mappers/invoice.mapper';
import { TransactionMapper } from './repository/mappers/transaction.mapper';
import { TransactionRepository } from './repository/transaction.repository';
import { InvoiceResolver } from './resolvers/invoice.resolver';
import { SalaryResolver } from './resolvers/salary.resolver';
import { TransactionResolver } from './resolvers/transaction.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionTypeOrmEntity, InvoiceTypeOrmEntity]),
    ProjectsModule,
    TimeEntriesModule,
    UsersModule,
    AuthModule,
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
