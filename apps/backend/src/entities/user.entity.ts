import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { UserAccount } from './user-accounts.entity';
import { InteractiveEntity } from './base.entity';

@Entity('users')
@Index('idx_user_email', ['email'], { unique: true })
@Index('idx_user_provider_ids', { synchronize: false })
export class User extends InteractiveEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ name: 'provider_ids', type: 'simple-array', default: '' })
  providerIds: string[];

  /**
   * System-level admin flag that bypasses all role-based access control.
   *
   * When true, grants access to all accounts and resources without requiring
   * entries in the users_accounts table. This is intentionally separate from
   * the business role hierarchy.
   *
   * Use cases:
   * - System maintenance and debugging
   * - Emergency access when role assignments are broken
   * - Cross-account operations during migrations
   * - Platform-level administrative tasks
   *
   * Security: Should only be granted to 1-2 platform administrators.
   * Performance: Bypasses database joins for permission checking.
   */
  @Column({ name: 'is_super_admin', type: 'boolean', default: false })
  isSuperAdmin: boolean;

  @OneToMany(() => UserAccount, (userAccount) => userAccount.user, {
    eager: true,
  })
  userAccounts?: UserAccount[];

  hasProvider(providerId: string): boolean {
    return this.providerIds.includes(providerId);
  }

  addProvider(providerId: string): void {
    if (!this.hasProvider(providerId)) {
      this.providerIds.push(providerId);
    }
  }

  removeProvider(providerId: string): void {
    this.providerIds = this.providerIds.filter((id) => id !== providerId);
  }
}
