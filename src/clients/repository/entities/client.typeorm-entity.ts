import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('clients')
export class ClientTypeOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('varchar', { length: 255 })
  email!: string;

  @Column('varchar', { length: 20, nullable: true })
  phone?: string;

  @Column('varchar', { length: 255, nullable: true })
  company?: string;

  @Column('varchar', { length: 255, nullable: true })
  industry?: string;

  @Column('varchar', { length: 50, default: 'active' })
  status!: string;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  ltv!: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  cac!: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  mrr!: number;

  @Column('date', { nullable: true })
  contractStart?: Date;

  @Column('date', { nullable: true })
  contractEnd?: Date;

  @Column('integer', { nullable: true })
  npsScore?: number;

  @Column('integer', { nullable: true })
  csatScore?: number;

  @Column('text', { nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column('timestamp', { nullable: true })
  deletedAt?: Date;
}
