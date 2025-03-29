import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Account } from './account.entity';
import { User } from './user.entity';

@Entity('audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'transaction_id', type: 'varchar', length: 255 })
    transactionId: string;

    @Column({ name: 'account_id', type: 'integer' })
    accountId: number;

    @Column({ name: 'user_id', type: 'integer' })
    userId: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    entity: string;

    @Column({ name: 'entity_id' })
    entityId: number;

    @Column({ name: 'transaction_type', type: 'varchar', length: 255 })
    transactionType: string;

    @Column({ type: 'json' })
    json: any;

    @Column({ name: 'ip_address', type: 'varchar', length: 255, nullable: true })
    ipAddress: string;

    @Column({ name: 'user_agent', type: 'varchar', length: 600, nullable: true })
    userAgent: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    timestamp: Date;

    @ManyToOne(() => Account, { eager: true })
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
