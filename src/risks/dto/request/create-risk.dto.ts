import { IsString, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

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
