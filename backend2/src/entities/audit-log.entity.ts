import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Account } from './account.entity';
import { User } from './user.entity';

@Entity('audit_logs')
export class AuditLog {
    @Column({ type: 'varchar', length: 255 })
    transaction_id: string;

    @Column({ type: 'integer' })
    account_id: number;

    @Column({ type: 'integer' })
    user_id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    entity: string;

    @PrimaryColumn()
    entity_id: number;

    @Column({ type: 'varchar', length: 255 })
    transaction_type: string;

    @Column({ type: 'json' })
    json: any;

    @Column({ type: 'varchar', length: 255, nullable: true })
    ip_address: string;

    @Column({ type: 'varchar', length: 600, nullable: true })
    user_agent: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    timestamp: Date;

    @ManyToOne(() => Account, { eager: true })
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
