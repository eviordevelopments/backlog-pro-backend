import { ObjectType, Field } from '@nestjs/graphql';
import { SalaryResponseDto } from './salary.response.dto';

@ObjectType()
export class FinancialReportResponseDto {
  @Field()
  projectId!: string;

  @Field()
  projectName!: string;

  @Field()
  budget!: number;

  @Field()
  spent!: number;

  @Field()
  totalIncome!: number;

  @Field()
  totalExpenses!: number;

  @Field()
  totalSalaries!: number;

  @Field()
  netProfit!: number;

  @Field()
  invoices!: number;

  @Field()
  transactions!: number;

  @Field()
  teamMembers!: number;

  @Field(() => [SalaryResponseDto])
  salaries!: SalaryResponseDto[];
}
