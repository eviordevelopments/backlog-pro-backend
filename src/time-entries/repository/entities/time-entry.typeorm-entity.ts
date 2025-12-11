import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

import { TaskTypeOrmEntity } from '../../../tasks/repository/entities/task.typeorm-entity';

@Entity('time_entries')
export class TimeEntryTypeOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  taskId!: string;

  @ManyToOne(() => TaskTypeOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task?: TaskTypeOrmEntity;

  @Column('uuid')
  userId!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  hours!: number;

  @Column('date')
  date!: Date;

  @Column('text', { nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column('timestamp', { nullable: true })
  deletedAt?: Date;
}
