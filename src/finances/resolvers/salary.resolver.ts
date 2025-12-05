import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CalculateIdealHourlyRateQuery } from '../application/queries/calculate-ideal-hourly-rate.query';
import { CalculateIdealHourlyRateQueryHandler } from '../application/queries/calculate-ideal-hourly-rate.query-handler';
import { CalculateSalariesQuery } from '../application/queries/calculate-salaries.query';
import { CalculateSalariesQueryHandler } from '../application/queries/calculate-salaries.query-handler';
import { GenerateFinancialReportQuery } from '../application/queries/generate-financial-report.query';
import { GenerateFinancialReportQueryHandler } from '../application/queries/generate-financial-report.query-handler';
import { FinancialReportResponseDto } from '../dto/response/financial-report.response.dto';
import { SalaryResponseDto } from '../dto/response/salary.response.dto';

@Resolver('Salary')
export class SalaryResolver {
  constructor(
    private readonly idealRateHandler: CalculateIdealHourlyRateQueryHandler,
    private readonly salariesHandler: CalculateSalariesQueryHandler,
    private readonly reportHandler: GenerateFinancialReportQueryHandler,
  ) {}

  @Query(() => Number)
  @UseGuards(JwtAuthGuard)
  async calculateIdealHourlyRate(@Args('projectId') projectId: string): Promise<number> {
    const query = new CalculateIdealHourlyRateQuery(projectId);
    return this.idealRateHandler.handle(query);
  }

  @Query(() => [SalaryResponseDto])
  @UseGuards(JwtAuthGuard)
  async calculateSalaries(@Args('projectId') projectId: string): Promise<SalaryResponseDto[]> {
    const query = new CalculateSalariesQuery(projectId);
    return this.salariesHandler.handle(query);
  }

  @Query(() => FinancialReportResponseDto)
  @UseGuards(JwtAuthGuard)
  async generateFinancialReport(
    @Args('projectId') projectId: string,
  ): Promise<FinancialReportResponseDto> {
    const query = new GenerateFinancialReportQuery(projectId);
    return this.reportHandler.handle(query);
  }
}
