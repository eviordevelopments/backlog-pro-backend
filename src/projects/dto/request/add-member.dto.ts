import { IsUUID, IsString, IsOptional } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddMemberDto {
  @Field()
  @IsUUID()
  userId!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  role?: string;
}
