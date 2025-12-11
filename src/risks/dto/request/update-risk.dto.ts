import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateRiskDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  probability?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  impact?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  mitigationStrategy?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  responsibleId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isCore?: boolean;
}
