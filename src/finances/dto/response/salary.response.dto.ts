import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SalaryResponseDto {
  @Field()
  userId!: string;

  @Field()
  userName!: string;

  @Field()
  salary!: number;

  @Field()
  idealHourlyRate!: number;
}
