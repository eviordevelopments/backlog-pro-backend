import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUrl } from 'class-validator';

@InputType()
export class UpdateAvatarDto {
  @Field()
  @IsString({ message: 'La URL del avatar debe ser un texto' })
  @IsUrl({}, { message: 'La URL del avatar no es válida' })
  avatarUrl!: string;
}
