import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { User } from './user.entity';

export abstract class SoftDeleteEntity {
  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}

export abstract class InteractiveEntity extends SoftDeleteEntity {
  @ManyToOne('User')
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne('User')
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @ManyToOne('User')
  @JoinColumn({ name: 'deleted_by' })
  deletedBy: User;
}
