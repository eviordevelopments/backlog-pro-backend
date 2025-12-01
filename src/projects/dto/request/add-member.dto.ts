import { IsUUID, IsString, IsOptional } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddMemberDto {
  @Field()
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  userId!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'El rol debe ser un texto' })
  role?: string;
}
