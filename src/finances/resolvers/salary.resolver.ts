import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { CalculateIdealHourlyRateQueryHandler } from '@finances/application/queries/calculate-ideal-hourly-rate.query-handler';
import { CalculateIdealHourlyRateQuery } from '@finances/application/queries/calculate-ideal-hourly-rate.query';
import { CalculateSalariesQueryHandler } from '@finances/application/queries/calculate-salaries.query-handler';
import { CalculateSalariesQuery } from '@finances/application/queries/calculate-salaries.query';
import { GenerateFinancialReportQueryHandler } from '@finances/application/queries/generate-financial-report.query-handler';
import { GenerateFinancialReportQuery } from '@finances/application/queries/generate-financial-report.query';

@Resolver('Salary')
export class SalaryResolver {
  constructor(
    private readonly idealRateHandler: CalculateIdealHourlyRateQueryHandler,
    private readonly salariesHandler: CalculateSalariesQueryHandler,
    private readonly reportHandler: GenerateFinancialReportQueryHandler,
  ) {}

  @Query(() => Number)
  @UseGuards(JwtAuthGuard)
  async calculateIdealHourlyRate(
    @Args('projectId') projectId: string
  ): Promise<number> {
    const query = new CalculateIdealHourlyRateQuery(projectId);
    return this.idealRateHandler.handle(query);
  }

  @Query(() => [Object])
  @UseGuards(JwtAuthGuard)
  async calculateSalaries(
    @Args('projectId') projectId: string
  ): Promise<any[]> {
    const query = new CalculateSalariesQuery(projectId);
    return this.salariesHandler.handle(query);
  }

  @Query(() => Object)
  @UseGuards(JwtAuthGuard)
  async generateFinancialReport(
    @Args('projectId') projectId: string
  ): Promise<any> {
    const query = new GenerateFinancialReportQuery(projectId);
    return this.reportHandler.handle(query);
  }
}
