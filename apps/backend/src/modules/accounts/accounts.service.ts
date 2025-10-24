import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../entities/account.entity';
import { CreateAccountDto, UpdateAccountDto } from './dto/account.dto';
import { ClsService } from 'nestjs-cls';
import { UserAccount } from '../../entities/user-accounts.entity';
import { User } from '../../entities/user.entity';
import { PaginationQueryDto, createPaginationMeta } from 'src/utils';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
    private readonly cls: ClsService,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const account = this.accountRepository.create(createAccountDto);
    return await this.accountRepository.save(account);
  }

  async findAll(user: User | null = null): Promise<Account[]> {
    if (!user) {
      user = this.cls.get('user');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user?.isSuperAdmin) {
      return await this.accountRepository.find();
    }

    /**
     * TODO: This is a temporary solution to get the accounts for the current user.
     * Maybe we should use a relation OneToMany between Account.
     */
    const userAccounts = await this.userAccountRepository.find({
      where: { userId: user?.id },
      relations: ['account'],
    });

    return userAccounts.map((userAccount) => userAccount.account) as Account[];
  }

  async findAllWithPagination(paginationQuery: PaginationQueryDto, user: User | null = null) {
    if (!user) {
      user = this.cls.get('user');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { page = 1, limit = 50 } = paginationQuery;
    const skip = (page - 1) * limit;

    if (user?.isSuperAdmin) {
      const [accounts, totalItems] = await this.accountRepository.findAndCount({
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      const meta = createPaginationMeta(totalItems, page, limit);

      return {
        data: accounts,
        meta,
      };
    }

    // For non-super admin users, get accounts through user-account relationship
    const [userAccounts, totalItems] = await this.userAccountRepository.findAndCount({
      where: { userId: user?.id },
      relations: ['account'],
      skip,
      take: limit,
      order: { account: { createdAt: 'DESC' } },
    });

    const accounts = userAccounts.map((userAccount) => userAccount.account) as Account[];
    const meta = createPaginationMeta(totalItems, page, limit);

    return {
      data: accounts,
      meta,
    };
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({ where: { id } });
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  async update(id: string, updateAccountDto: UpdateAccountDto): Promise<Account> {
    await this.accountRepository.update(id, { ...updateAccountDto, id });
    return await this.findOne(id);
  }
}
