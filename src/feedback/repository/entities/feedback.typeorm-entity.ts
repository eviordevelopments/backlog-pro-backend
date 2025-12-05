import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('feedback')
@Index(['toUserId'])
@Index(['sprintId'])
export class FeedbackTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  fromUserId!: string;

  @Column({ type: 'uuid' })
  toUserId!: string;

  @Column({ type: 'varchar', length: 50 })
  type!: string;

  @Column({ type: 'varchar', length: 100 })
  category!: string;

  @Column({ type: 'integer' })
  rating!: number;

  @Column({ type: 'text' })
  comment!: string;

  @Column({ type: 'uuid', nullable: true })
  sprintId?: string | null;

  @Column({ type: 'boolean', default: false })
  isAnonymous!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
