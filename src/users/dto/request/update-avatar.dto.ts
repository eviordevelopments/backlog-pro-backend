import { IsString, IsUrl } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateAvatarDto {
  @Field()
  @IsString({ message: 'La URL del avatar debe ser un texto' })
  @IsUrl({}, { message: 'La URL del avatar no es válida' })
  avatarUrl!: string;
}
