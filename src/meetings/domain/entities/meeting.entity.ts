import { v4 as uuid } from 'uuid';

export interface Attendee {
  userId: string;
  status: 'present' | 'absent' | 'pending';
}

export class Meeting {
  private id: string;
  private title: string;
  private type: string; // 'standup', 'planning', 'review', 'retrospective', 'other'
  private projectId: string | null;
  private sprintId: string | null;
  private dateTime: Date;
  private duration: number; // in minutes
  private participants: string[];
  private ownerId: string;
  private agenda: string;
  private notes: string;
  private isRecurring: boolean;
  private recurringPattern: string | null;
  private status: string; // 'scheduled', 'in_progress', 'completed', 'cancelled'
  private attendance: Attendee[];
  private createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;

  constructor(
    title: string,
    type: string,
    dateTime: Date,
    duration: number,
    ownerId: string,
    agenda: string = '',
    notes: string = '',
    projectId?: string | null,
    sprintId?: string | null,
    participants?: string[],
    isRecurring?: boolean,
    recurringPattern?: string | null,
    status?: string,
    attendance?: Attendee[],
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    this.id = id || uuid();
    this.title = title;
    this.type = type;
    this.dateTime = dateTime;
    this.duration = duration;
    this.ownerId = ownerId;
    this.agenda = agenda;
    this.notes = notes;
    this.projectId = projectId || null;
    this.sprintId = sprintId || null;
    this.participants = participants || [];
    this.isRecurring = isRecurring || false;
    this.recurringPattern = recurringPattern || null;
    this.status = status || 'scheduled';
    this.attendance = attendance || [];
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.deletedAt = deletedAt || null;
  }

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getType(): string {
    return this.type;
  }

  getProjectId(): string | null {
    return this.projectId;
  }

  getSprintId(): string | null {
    return this.sprintId;
  }

  getDateTime(): Date {
    return this.dateTime;
  }

  getDuration(): number {
    return this.duration;
  }

  getParticipants(): string[] {
    return this.participants;
  }

  getOwnerId(): string {
    return this.ownerId;
  }

  getAgenda(): string {
    return this.agenda;
  }

  getNotes(): string {
    return this.notes;
  }

  isRecurringMeeting(): boolean {
    return this.isRecurring;
  }

  getRecurringPattern(): string | null {
    return this.recurringPattern;
  }

  getStatus(): string {
    return this.status;
  }

  getAttendance(): Attendee[] {
    return this.attendance;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getDeletedAt(): Date | null {
    return this.deletedAt;
  }

  setTitle(title: string): void {
    this.title = title;
    this.updatedAt = new Date();
  }

  setAgenda(agenda: string): void {
    this.agenda = agenda;
    this.updatedAt = new Date();
  }

  setNotes(notes: string): void {
    this.notes = notes;
    this.updatedAt = new Date();
  }

  setStatus(status: string): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  setParticipants(participants: string[]): void {
    this.participants = participants;
    this.updatedAt = new Date();
  }

  addParticipant(userId: string): void {
    if (!this.participants.includes(userId)) {
      this.participants.push(userId);
      this.updatedAt = new Date();
    }
  }

  removeParticipant(userId: string): void {
    this.participants = this.participants.filter((id) => id !== userId);
    this.updatedAt = new Date();
  }

  recordAttendance(userId: string, status: 'present' | 'absent' | 'pending'): void {
    const existing = this.attendance.find((a) => a.userId === userId);
    if (existing) {
      existing.status = status;
    } else {
      this.attendance.push({ userId, status });
    }
    this.updatedAt = new Date();
  }

  setDeletedAt(date: Date | null): void {
    this.deletedAt = date;
    this.updatedAt = new Date();
  }
}
