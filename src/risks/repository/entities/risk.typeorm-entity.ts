import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('risks')
@Index(['projectId'])
@Index(['status'])
export class RiskTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  projectId!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 100 })
  category!: string;

  @Column({ type: 'varchar', length: 50 })
  probability!: string;

  @Column({ type: 'varchar', length: 50 })
  impact!: string;

  @Column({ type: 'text', nullable: true })
  mitigationStrategy?: string;

  @Column({ type: 'uuid' })
  responsibleId!: string;

  @Column({ type: 'varchar', length: 50, default: 'identified' })
  status!: string;

  @Column({ type: 'boolean', default: false })
  isCore!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  comments?: any[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
