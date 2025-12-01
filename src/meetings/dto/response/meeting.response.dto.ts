export interface AttendeeResponse {
  userId: string;
  status: 'present' | 'absent' | 'pending';
}

export class MeetingResponseDto {
  id!: string;
  title!: string;
  type!: string;
  projectId?: string;
  sprintId?: string;
  dateTime!: Date;
  duration!: number;
  participants!: string[];
  ownerId!: string;
  agenda?: string;
  notes?: string;
  isRecurring!: boolean;
  recurringPattern?: string;
  status!: string;
  attendance!: AttendeeResponse[];
  createdAt!: Date;
  updatedAt!: Date;
}
