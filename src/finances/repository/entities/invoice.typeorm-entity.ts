import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('invoices')
@Index(['clientId'])
@Index(['projectId'])
@Index(['status'])
@Index(['invoiceNumber'], { unique: true })
export class InvoiceTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  invoiceNumber!: string;

  @Column({ type: 'uuid' })
  clientId!: string;

  @Column({ type: 'uuid', nullable: true })
  projectId?: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount!: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  tax!: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total!: number;

  @Column({ type: 'varchar', length: 50, default: 'draft' })
  status!: string; // 'draft', 'sent', 'paid', 'overdue', 'cancelled'

  @Column({ type: 'date' })
  issueDate!: Date;

  @Column({ type: 'date' })
  dueDate!: Date;

  @Column({ type: 'date', nullable: true })
  paidDate?: Date;

  @Column({ type: 'jsonb', nullable: true })
  items?: unknown[];

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
