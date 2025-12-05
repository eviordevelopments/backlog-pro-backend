import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('achievements')
export class AchievementTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar', length: 255 })
  icon!: string;

  @Column({ type: 'varchar', length: 100 })
  category!: string;

  @Column({ type: 'integer' })
  points!: number;

  @Column({ type: 'varchar', length: 50 })
  rarity!: string;

  @Column({ type: 'text' })
  requirement!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity('user_achievements')
export class UserAchievementTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'uuid' })
  achievementId!: string;

  @Column({ type: 'timestamp' })
  unlockedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
