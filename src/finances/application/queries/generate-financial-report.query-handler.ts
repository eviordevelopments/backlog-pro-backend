import { Injectable } from '@nestjs/common';
import { GenerateFinancialReportQuery } from './generate-financial-report.query';
import { ProjectRepository } from '@projects/repository/project.repository';
import { TransactionRepository } from '@finances/repository/transaction.repository';
import { InvoiceRepository } from '@finances/repository/invoice.repository';
import { CalculateSalariesQueryHandler } from './calculate-salaries.query-handler';
import { CalculateSalariesQuery } from './calculate-salaries.query';

@Injectable()
export class GenerateFinancialReportQueryHandler {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly salariesHandler: CalculateSalariesQueryHandler,
  ) {}

  async handle(query: GenerateFinancialReportQuery): Promise<any> {
    const project = await this.projectRepository.getById(query.projectId);
    if (!project) {
      throw new Error(`Project with id ${query.projectId} not found`);
    }

    const transactions = await this.transactionRepository.getByProjectId(
      query.projectId
    );
    const invoices = await this.invoiceRepository.getByProjectId(
      query.projectId
    );
    const salaries = await this.salariesHandler.handle(
      new CalculateSalariesQuery(query.projectId)
    );

    const totalIncome = invoices.reduce(
      (sum, inv) => sum + inv.getTotal().getValue(),
      0
    );
    const totalExpenses = transactions.reduce((sum, trans) => {
      return trans.getType().getValue() === 'expense'
        ? sum + trans.getAmount().getValue()
        : sum;
    }, 0);
    const totalSalaries = salaries.reduce((sum, s) => sum + s.salary, 0);

    return {
      projectId: query.projectId,
      projectName: project.name,
      budget: project.budget,
      spent: project.spent,
      totalIncome,
      totalExpenses,
      totalSalaries,
      netProfit: totalIncome - totalExpenses - totalSalaries,
      invoices: invoices.length,
      transactions: transactions.length,
      teamMembers: salaries.length,
      salaries,
    };
  }
}
