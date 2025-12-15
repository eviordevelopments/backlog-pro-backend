import { Injectable } from '@nestjs/common';

import { ProjectRepository } from '../../../projects/repository/project.repository';
import { InvoiceRepository } from '../../repository/invoice.repository';
import { TransactionRepository } from '../../repository/transaction.repository';

import { CalculateSalariesQueryHandler } from './calculate-salaries.query-handler';
import { CalculateSalariesQuery } from './calculate-salaries.query';
import { GenerateFinancialReportQuery } from './generate-financial-report.query';

@Injectable()
export class GenerateFinancialReportQueryHandler {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly salariesHandler: CalculateSalariesQueryHandler,
  ) {}

  async handle(query: GenerateFinancialReportQuery): Promise<{
    projectId: string;
    projectName: string;
    budget: number;
    spent: number;
    totalIncome: number;
    totalExpenses: number;
    totalSalaries: number;
    netProfit: number;
    invoices: number;
    transactions: number;
    teamMembers: number;
    salaries: Array<{ userId: string; userName: string; salary: number; idealHourlyRate: number }>;
  }> {
    const project = await this.projectRepository.getById(query.projectId);
    if (!project) {
      throw new Error(`Project with id ${query.projectId} not found`);
    }

    const transactions = await this.transactionRepository.getByProjectId(query.projectId);
    const invoices = await this.invoiceRepository.getByProjectId(query.projectId);
    const salaries = await this.salariesHandler.handle(new CalculateSalariesQuery(query.projectId));

    const totalIncome = invoices.reduce((sum, inv) => sum + inv.getTotal().getValue(), 0);
    const totalExpenses = transactions.reduce((sum, trans) => {
      return trans.getType().getValue() === 'expense' ? sum + trans.getAmount().getValue() : sum;
    }, 0);
    const totalSalaries = salaries.reduce((sum, s: { salary: number }) => sum + s.salary, 0);

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
