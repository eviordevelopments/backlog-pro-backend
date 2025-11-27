import { IsString, IsUrl } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateAvatarDto {
  @Field()
  @IsString()
  @IsUrl()
  avatarUrl!: string;
}
