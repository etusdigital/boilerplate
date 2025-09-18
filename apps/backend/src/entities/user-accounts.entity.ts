import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Account } from './account.entity';
import { User } from './user.entity';
import { Role } from '../auth/enums/roles.enum';

@Entity('users_accounts')
@Index('idx_account_user', ['accountId', 'userId'], { unique: true })
export class UserAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'account_id', type: 'uuid' })
  accountId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({
    name: 'role',
    type: 'varchar',
    default: Role.VIEWER,
    nullable: true,
  })
  role: Role;

  @ManyToOne(() => Account, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id', foreignKeyConstraintName: 'fk_user_accounts_account_id' })
  account?: Account;

  @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'fk_user_accounts_user_id' })
  user?: User;
}
