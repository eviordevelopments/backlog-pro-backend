import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('meetings')
@Index(['projectId'])
@Index(['sprintId'])
@Index(['status'])
export class MeetingTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 50 })
  type!: string;

  @Column({ type: 'uuid', nullable: true })
  projectId?: string;

  @Column({ type: 'uuid', nullable: true })
  sprintId?: string;

  @Column({ type: 'timestamp' })
  dateTime!: Date;

  @Column({ type: 'integer' })
  duration!: number;

  @Column({ type: 'jsonb', nullable: true })
  participants?: string[];

  @Column({ type: 'uuid' })
  ownerId!: string;

  @Column({ type: 'text', nullable: true })
  agenda?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'boolean', default: false })
  isRecurring!: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  recurringPattern?: string;

  @Column({ type: 'varchar', length: 50, default: 'scheduled' })
  status!: string;

  @Column({ type: 'jsonb', nullable: true })
  attendance?: unknown[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
