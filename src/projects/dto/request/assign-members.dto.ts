import { IsUUID, IsArray, ValidateNested, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class MemberAssignmentDto {
  @Field()
  @IsUUID()
  userId!: string;

  @Field()
  @IsString()
  @IsIn(['owner', 'lead', 'developer', 'viewer'])
  role!: string;
}

@InputType()
export class AssignMembersDto {
  @Field(() => [MemberAssignmentDto])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberAssignmentDto)
  members!: MemberAssignmentDto[];
}
