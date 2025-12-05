import { Field, ObjectType } from '@nestjs/graphql';

export interface AttendeeResponse {
  userId: string;
  status: 'present' | 'absent' | 'pending';
}

@ObjectType()
export class MeetingResponseDto {
  @Field()
  id!: string;

  @Field()
  title!: string;

  @Field()
  type!: string;

  @Field({ nullable: true })
  projectId?: string;

  @Field({ nullable: true })
  sprintId?: string;

  @Field()
  dateTime!: Date;

  @Field()
  duration!: number;

  @Field(() => [String])
  participants!: string[];

  @Field()
  ownerId!: string;

  @Field({ nullable: true })
  agenda?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  isRecurring!: boolean;

  @Field({ nullable: true })
  recurringPattern?: string;

  @Field()
  status!: string;

  @Field(() => [String], { nullable: true })
  attendance!: AttendeeResponse[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
