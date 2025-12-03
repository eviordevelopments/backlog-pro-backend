import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateRiskDto {
  @Field()
  @IsUUID()
  projectId!: string;

  @Field()
  @IsString()
  title!: string;

  @Field()
  @IsString()
  category!: string;

  @Field()
  @IsString()
  probability!: string;

  @Field()
  @IsString()
  impact!: string;

  @Field()
  @IsUUID()
  responsibleId!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  mitigationStrategy?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isCore?: boolean;
}
