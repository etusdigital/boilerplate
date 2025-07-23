import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { SoftDeleteEntity } from './base.entity';
import { UserAccount } from './user-accounts.entity';

@Entity('users')
export class User extends SoftDeleteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 500, unique: true })
  email: string | null;

  @Column({
    name: 'profile_image',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  profileImage: string;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({ name: 'provider_id', type: 'varchar', length: 255, nullable: true })
  providerId: string;

  @Column({ name: 'is_super_admin', type: 'boolean', default: false })
  isSuperAdmin: boolean;

  @OneToMany(() => UserAccount, (userAccount) => userAccount.user, {
    eager: true,
  })
  userAccounts?: UserAccount[];
}
