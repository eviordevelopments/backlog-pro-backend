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
import { SprintTypeOrmEntity } from '../../../sprints/repository/entities/sprint.typeorm-entity';

@Entity('tasks')
export class TaskTypeOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('varchar', { length: 255 })
  title!: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('uuid')
  projectId!: string;

  @ManyToOne(() => ProjectTypeOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project?: ProjectTypeOrmEntity;

  @Column('uuid', { nullable: true })
  sprintId?: string;

  @ManyToOne(() => SprintTypeOrmEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'sprintId' })
  sprint?: SprintTypeOrmEntity;

  @Column('varchar', { length: 50, default: 'todo' })
  status!: string;

  @Column('varchar', { length: 50, default: 'medium' })
  priority!: string;

  @Column('uuid', { nullable: true })
  assignedTo?: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  estimatedHours!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  actualHours!: number;

  @Column('integer', { default: 0 })
  storyPoints!: number;

  @Column('date', { nullable: true })
  dueDate?: Date;

  @Column('jsonb', { default: '[]' })
  tags!: string[];

  @Column('jsonb', { default: '[]' })
  dependencies!: string[];

  @Column('jsonb', { default: '[]' })
  subtasks!: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column('timestamp', { nullable: true })
  deletedAt?: Date;
}
