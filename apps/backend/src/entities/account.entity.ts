import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { SoftDeleteEntity } from './base.entity';

@Entity('accounts')
export class Account extends SoftDeleteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  domain: string;
}
