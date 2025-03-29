import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Account } from './account.entity';
import { User } from './user.entity';

@Entity('users_accounts')
export class UserAccount {
    @PrimaryColumn({name: 'account_id', type: 'integer' })
    accountId: number;

    @Column({name: 'user_id', type: 'integer' })
    userId: number;

    @ManyToOne(() => Account, { eager: false })
    @JoinColumn({ name: 'account_id' })
    account?: Account;

    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'user_id' })
    user?: User;
}
