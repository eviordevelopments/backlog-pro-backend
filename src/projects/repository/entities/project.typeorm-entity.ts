import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('projects')
@Index(['clientId'])
@Index(['status'])
export class ProjectTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid' })
  clientId!: string;

  @Column({ type: 'varchar', length: 50, default: 'planning' })
  status!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  methodology?: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  budget!: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  spent!: number;

  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ type: 'integer', default: 0 })
  progress!: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  devopsStage?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  priority?: string;

  @Column({ type: 'jsonb', nullable: true })
  tags?: string[];

  @Column({ type: 'varchar', length: 500, nullable: true })
  repositoryUrl?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  deploymentUrl?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
