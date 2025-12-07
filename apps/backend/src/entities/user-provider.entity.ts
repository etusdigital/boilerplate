import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

/**
 * Join table for User to Identity Provider relationship.
 * Eliminates database-specific provider ID queries by using
 * standard SQL JOINs instead of array contains operations.
 *
 * Supports multiple identity providers per user (Google, Auth0, GitHub, etc.)
 */
@Entity('user_providers')
@Index('idx_user_providers_lookup', ['providerName', 'providerUserId'], {
  unique: true,
})
@Index('idx_user_providers_user_id', ['userId'])
export class UserProvider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'provider_name', type: 'varchar', length: 50 })
  providerName: string;

  @Column({ name: 'provider_user_id', type: 'varchar', length: 255 })
  providerUserId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.providers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /**
   * Parse a combined provider ID like "google|123456" into name and user ID
   */
  static parseProviderId(providerId: string): {
    providerName: string;
    providerUserId: string;
  } {
    const separatorIndex = providerId.indexOf('|');
    if (separatorIndex === -1) {
      // Legacy format or unknown, use full string as ID with 'unknown' provider
      return { providerName: 'unknown', providerUserId: providerId };
    }

    return {
      providerName: providerId.substring(0, separatorIndex),
      providerUserId: providerId.substring(separatorIndex + 1),
    };
  }

  /**
   * Create a combined provider ID from name and user ID
   */
  static toProviderId(providerName: string, providerUserId: string): string {
    return `${providerName}|${providerUserId}`;
  }
}
