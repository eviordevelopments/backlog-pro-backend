import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsString, IsUUID, ValidateNested } from 'class-validator';

@InputType()
export class MemberAssignmentDto {
  @Field()
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  userId!: string;

  @Field()
  @IsString({ message: 'El rol debe ser un texto' })
  @IsIn(['owner', 'lead', 'developer', 'viewer'], {
    message: 'El rol debe ser uno de: owner, lead, developer, viewer',
  })
  role!: string;
}

@InputType()
export class AssignMembersDto {
  @Field(() => [MemberAssignmentDto])
  @IsArray({ message: 'Los miembros deben ser un array' })
  @ValidateNested({ each: true, message: 'Cada miembro debe ser válido' })
  @Type(() => MemberAssignmentDto)
  members!: MemberAssignmentDto[];
}
