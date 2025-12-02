import { ObjectType, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';

@ObjectType()
export class NotificationResponseDto {
  @Field()
  id!: string;

  @Field()
  userId!: string;

  @Field()
  type!: string;

  @Field()
  title!: string;

  @Field()
  message!: string;

  @Field({ nullable: true })
  @Transform(({ value }) => value ? JSON.stringify(value) : undefined)
  metadata?: string;

  @Field()
  isRead!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
