import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProjectTypeOrmEntity } from '../../../projects/repository/entities/project.typeorm-entity';

@Entity('sprints')
export class SprintTypeOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('uuid')
  projectId!: string;

  @ManyToOne(() => ProjectTypeOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project?: ProjectTypeOrmEntity;

  @Column('text', { nullable: true })
  goal?: string;

  @Column('date')
  startDate!: Date;

  @Column('date')
  endDate!: Date;

  @Column('varchar', { length: 50, default: 'planning' })
  status!: string;

  @Column('integer', { default: 0 })
  velocity!: number;

  @Column('integer', { default: 0 })
  storyPointsCommitted!: number;

  @Column('integer', { default: 0 })
  storyPointsCompleted!: number;

  @Column('jsonb', { default: '[]' })
  teamMembers!: string[];

  @Column('timestamp', { nullable: true })
  sprintPlanningDate?: Date;

  @Column('timestamp', { nullable: true })
  sprintReviewDate?: Date;

  @Column('timestamp', { nullable: true })
  sprintRetrospectiveDate?: Date;

  @Column('varchar', { length: 5, default: '09:00' })
  dailyStandupTime!: string;

  @Column('text', { nullable: true })
  retrospectiveNotes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column('timestamp', { nullable: true })
  deletedAt?: Date;
}
