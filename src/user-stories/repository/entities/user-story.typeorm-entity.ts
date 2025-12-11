import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('user_stories')
@Index(['projectId'])
@Index(['sprintId'])
@Index(['status'])
export class UserStoryTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  projectId!: string;

  @Column({ type: 'uuid', nullable: true })
  sprintId?: string | null;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 100 })
  userType!: string;

  @Column({ type: 'text' })
  action!: string;

  @Column({ type: 'text' })
  benefit!: string;

  @Column({ type: 'jsonb', nullable: true })
  acceptanceCriteria?: unknown[];

  @Column({ type: 'integer', default: 0 })
  storyPoints!: number;

  @Column({ type: 'varchar', length: 50 })
  priority!: string;

  @Column({ type: 'varchar', length: 50, default: 'backlog' })
  status!: string;

  @Column({ type: 'uuid', nullable: true })
  assignedTo?: string | null;

  @Column({ type: 'text', nullable: true })
  definitionOfDone?: string;

  @Column({ type: 'text', nullable: true })
  impactMetrics?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
