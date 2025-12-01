import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class WorkedHoursResponseDto {
  @Field()
  userId!: string;

  @Field(() => Float)
  totalHours!: number;

  @Field({ nullable: true })
  projectId?: string;
}
