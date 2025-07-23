import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { User } from './user.entity';
import { Role } from '../auth/enums/roles.enum';

@Entity('users_accounts')
export class UserAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'account_id', type: 'integer' })
  accountId: number;

  @Column({ name: 'user_id', type: 'integer' })
  userId: number;

  @Column({
    name: 'role',
    type: 'varchar',
    default: Role.READER,
    nullable: true,
  })
  role: Role;

  @ManyToOne(() => Account, { eager: true })
  @JoinColumn({ name: 'account_id' })
  account?: Account;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
